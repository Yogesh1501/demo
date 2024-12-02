from flask import Flask, jsonify, request, session, send_from_directory
from flask_cors import CORS
from flask_mysqldb import MySQL
import os
from math import ceil
from datetime import datetime
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, ValidationError
import bcrypt
from werkzeug.utils import secure_filename
from flask_bcrypt import Bcrypt
import re
from datetime import datetime
import traceback



app = Flask(__name__, static_folder='../Frontend/build', static_url_path='/')

# Initialize Bcrypt
bcrypt = Bcrypt(app)

UPLOAD_FOLDER = 'static/uploads/'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# CORS configuration
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# MySQL database configuration
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_PORT'] = 3306
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'registerdatabase'
app.secret_key = os.getenv('SECRET_KEY', os.urandom(24))

mysql = MySQL(app)
# CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

FLATS_PER_PAGE = 10



class RegisterForm(FlaskForm):
    username = StringField("Name", validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Register")

    def validate_email(self, field):
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM register WHERE email=%s", (field.data,))
        user = cursor.fetchone()
        cursor.close()
        if user:
            raise ValidationError('Email already taken.')

class LoginForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Login")

# Serve React frontend
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validate inputs
    if not all([username, email, password]):
        return jsonify({'errors': ['All fields are required']}), 400

    if len(password) < 8:
        return jsonify({'errors': ['Password must be at least 8 characters long']}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("INSERT INTO register (username, email, password) VALUES (%s, %s, %s)",
                       (username, email, hashed_password))
        mysql.connection.commit()
        cursor.close()
        return jsonify({'message': 'Registration successful'}), 201
    except Exception as e:
        return jsonify({'message': 'An error occurred: ' + str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return jsonify({'message': 'Username and password are required.'}), 400

    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM register WHERE username=%s", (username,))
        user = cursor.fetchone()
        cursor.close()
    except Exception as e:
        return jsonify({'message': 'Database query error: ' + str(e)}), 500

    if user and bcrypt.check_password_hash(user[3], password):  # user[3] is the password hash
        session['user_id'] = user[0]
        session['role'] = 'user'
        first_login = user[4]  # Assuming first_login is the 5th column
        if first_login:
            return jsonify({
                'message': 'Login successful', 
                'first_login': True, 
                'role': 'user'
            }), 200

        return jsonify({
            'message': 'Login successful', 
            'user_id': user[0], 
            'first_login': False, 
            'role': 'user'
        }), 200


    else:
        return jsonify({'message': 'Invalid credentials.'}), 401


@app.route('/change-password', methods=['POST'])
def change_password():
    data = request.get_json()
    username = data.get('username')
    new_password = data.get('new_password')

    if len(new_password) < 8:
        return jsonify({'message': 'Password must be at least 8 characters long'}), 400

    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    try:
        cursor = mysql.connection.cursor()
        cursor.execute("UPDATE register SET password=%s, first_login=FALSE WHERE username=%s", 
                       (hashed_password, username))
        mysql.connection.commit()
        cursor.close()
        
        return jsonify({'message': 'Password updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'An error occurred: ' + str(e)}), 500

@app.route('/admin/register', methods=['POST'])
def admin_register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    mobilenumber = data.get('mobilenumber')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')

    # Validate input
    if not name or not email or not mobilenumber or not password:
        return jsonify({'error': 'Please fill out all fields'}), 400
    
    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400
    
    if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
        return jsonify({'error': 'Invalid email address'}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        # Insert new admin into the database
        cursor = mysql.connection.cursor()
        cursor.execute(
            "INSERT INTO admins (name, email, mobilenumber, password) VALUES (%s, %s, %s, %s)",
            (name, email, mobilenumber, hashed_password)
        )
        mysql.connection.commit()
        cursor.close()

        return jsonify({'message': 'Admin registered successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin login route
@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    login_identifier = data.get('loginIdentifier')
    password = data.get('password')

    if not login_identifier or not password:
        return jsonify({'error': 'Please fill out all fields'}), 400

    try:
        # Check if admin exists by email or mobile number
        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT * FROM admins WHERE email = %s OR mobilenumber = %s", 
            (login_identifier, login_identifier)
        )
        admin = cursor.fetchone()
        cursor.close()

        if not admin:
            return jsonify({'error': 'Invalid login credentials'}), 401
        
        # Check password
        if bcrypt.check_password_hash(admin[4], password):  # admin[4] is the hashed password
            return jsonify({
                'message': 'Login successful',
                'name': admin[1],       
                'email': admin[2],      
                'mobilenumber': admin[3], 
                'role': 'admin'
                }), 200
        else:
            return jsonify({'error': 'Invalid login credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    



@app.route('/maindash', methods=['GET'])
def dashboard():
    if 'user_id' in session:
        user_id = session['user_id']
        try:
            cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM register WHERE id=%s", (user_id,))
            user = cursor.fetchone()
            cursor.close()

            if user:
                return jsonify({'user': {'name': user[1], 'email': user[2]}}), 200
        except Exception as e:
            return jsonify({'message': 'Database query error: ' + str(e)}), 500

    return jsonify({'message': 'Unauthorized'}), 401


# @app.route('/logout', methods=['POST'])
# def logout():
#     session.pop('user_id', None)
#     return jsonify({'message': 'You have been logged out successfully.'}), 200


@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()  # Clear the session to log the user out
    return jsonify({"message": "Logged out successfully"}), 200

# Fallback for React Router
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')


# Fetch flats with search and pagination
@app.route('/flats', methods=['GET'])
def get_flats():
    search = request.args.get('search', '')
    page = int(request.args.get('page', 1))

    cursor = mysql.connection.cursor()

    # Define the offset for pagination
    offset = (page - 1) * FLATS_PER_PAGE
    
    # Fetch flats with search and pagination
    query = """
    SELECT flatNumber, blockNumber, ownerName, ownerContact, residents, status, flatType, rentType, startDate
    FROM flat
    WHERE flatNumber LIKE %s OR ownerName LIKE %s OR status LIKE %s
    LIMIT %s OFFSET %s
    """
    cursor.execute(query, (f"%{search}%", f"%{search}%", f"%{search}%", FLATS_PER_PAGE, offset))
    flats = cursor.fetchall()

    # Fetch the column names and create dictionaries for each row
    column_names = [desc[0] for desc in cursor.description]
    flats_data = [dict(zip(column_names, row)) for row in flats]

    # Get the total number of flats for pagination
    cursor.execute("SELECT COUNT(*) as count FROM flat WHERE flatNumber LIKE %s OR ownerName LIKE %s OR status LIKE %s", 
                   (f"%{search}%", f"%{search}%", f"%{search}%"))
    total_flats = cursor.fetchone()[0]  # Accessing the count as the first element of the tuple
    total_pages = ceil(total_flats / FLATS_PER_PAGE)

    cursor.close()

    return jsonify({
        'flats': flats_data,
        'totalPages': total_pages
    })
# Add or update a flat

@app.route('/flatForm', methods=['POST'])
def add_flat():
    data = request.get_json()
    
    # Validate data
    required_fields = ['flatNumber', 'ownerName', 'ownerContact', 'status', 'rentType']
    errors = {}
    for field in required_fields:
        if not data.get(field):
            errors[field] = f"{field} is required"
    
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400

    cursor = mysql.connection.cursor()

    try:
        # Insert the new flat into the database
        query = """
        INSERT INTO flat (flatNumber, blockNumber, ownerName, ownerContact, residents, flatType, status, rentType, startDate)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data['flatNumber'], 
            data['blockNumber'], 
            data['ownerName'], 
            data['ownerContact'], 
            data['residents'], 
            data['flatType'], 
            data['status'], 
            data['rentType'], 
            data['startDate']
        ))

        mysql.connection.commit()

    except mysql.connection.IntegrityError as e:
        return jsonify({'success': False, 'error': 'Flat number already exists.'}), 400

    finally:
        cursor.close()  # Ensure cursor is closed after execution

    return jsonify({'success': True, 'flat': data}) 

@app.route('/flats/<int:flatNumber>', methods=['DELETE'])
def delete_flat(flatNumber):
    cursor = mysql.connection.cursor()
    
    try:
        # Delete the flat with the given flatNumber
        query = "DELETE FROM flat WHERE flatNumber = %s"
        cursor.execute(query, (flatNumber,))
        mysql.connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'success': False, 'message': 'Flat not found'}), 404
        
        return jsonify({'success': True, 'message': 'Flat deleted successfully'})

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
    
    finally:
        cursor.close()

# Route to submit a complaint
@app.route('/complaints', methods=['POST'])
def submit_complaint():
    data = request.json
    if not data or 'name' not in data or 'flatNumber' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    # Insert complaint into the database
    cursor = mysql.connection.cursor()
    
    try:
        query = """
        INSERT INTO complaints (name, flatNumber, dateOfRegistration, complaintType, subject, description, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data['name'], 
            data['flatNumber'], 
            data.get('dateOfRegistration', str(datetime.now().date())),  # Defaults to today's date
            data['complaintType'], 
            data['subject'], 
            data['description'], 
            'Pending'  # Default status for new complaints
        ))
        mysql.connection.commit()

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500
    
    finally:
        cursor.close()

    return jsonify({"message": "Complaint submitted successfully"}), 201

@app.route('/complaints', methods=['GET'])
def get_complaints():
    cursor = mysql.connection.cursor()
    try:
        cursor.execute("SELECT * FROM complaints")
        complaints = cursor.fetchall()
        
        # Formatting the data for the frontend
        complaint_list = []
        for complaint in complaints:
            complaint_list.append({
                "id": complaint[0],  # Assuming the first column is the complaint ID
                "name": complaint[1],
                "flatNumber": complaint[2],
                "dateOfRegistration": str(complaint[3]),  # Convert date to string
                "complaintType": complaint[4],
                "subject": complaint[5],
                "description": complaint[6],
                "status": complaint[7]
            })
        
        return jsonify(complaint_list), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()

@app.route('/complaints/<int:complaint_id>', methods=['PUT'])
def update_complaint_status(complaint_id):
    data = request.json
    new_status = data.get('status')

    if new_status not in ['Pending', 'In Progress', 'Resolved']:
        return jsonify({"error": "Invalid status"}), 400

    cursor = mysql.connection.cursor()
    try:
        query = "UPDATE complaints SET status = %s WHERE id = %s"
        cursor.execute(query, (new_status, complaint_id))
        mysql.connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Complaint not found"}), 404

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()

    return jsonify({"message": "Complaint status updated"}), 200




@app.route('/addnotice', methods=['POST'])
def add_notice():
    data = request.get_json()
    nname = data.get('nname')
    ntype = data.get('ntype')
    ndate = data.get('ndate')
    nmsg = data.get('nmsg')

    cursor = mysql.connection.cursor()

    try:
        # Insert query
        query = "INSERT INTO notices (nname, ntype, ndate, nmsg) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (nname, ntype, ndate, nmsg))
        mysql.connection.commit()  

        return jsonify({"success": True, "message": "Notice created successfully!"})

    except Exception as e:
        mysql.connection.rollback()  
        return jsonify({"success": False, "message": str(e)})

    finally:
        cursor.close()  


# Fetch all notices
@app.route('/notices', methods=['GET'])
def get_notices():
    cursor = mysql.connection.cursor()
    try:
        cursor.execute("SELECT id, nname, ntype, ndate FROM notices")
        notices = cursor.fetchall()
        result = [{"id": notice[0], "nname": notice[1], "ntype": notice[2], "ndate": notice[3]} for notice in notices]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"message": "Failed to fetch notices"}), 500
    finally:
        cursor.close()

# Fetch specific notice by ID
@app.route('/notice/<int:id>', methods=['GET'])
def get_notice(id):
    cursor = mysql.connection.cursor()
    try:
        cursor.execute("SELECT id, nname, ntype, ndate, nmsg FROM notices WHERE id = %s", (id,))
        notice = cursor.fetchone()
        if notice:
            result = {
                "id": notice[0],
                "nname": notice[1],
                "ntype": notice[2],
                "ndate": notice[3],
                "nmsg": notice[4]
            }
            return jsonify(result), 200
        else:
            return jsonify({"message": "Notice not found"}), 404
    except Exception as e:
        return jsonify({"message": "Failed to fetch notice"}), 500
    finally:
        cursor.close()

@app.route('/latest-notice', methods=['GET'])
def get_latest_notice():
    cursor = mysql.connection.cursor()
    try:
        cursor.execute("SELECT id, nname, ntype, ndate, nmsg FROM notices ORDER BY ndate DESC LIMIT 1")
        notice = cursor.fetchone()
        if notice:
            result = {
                "id": notice[0],
                "nname": notice[1],
                "ntype": notice[2],
                "ndate": notice[3],
                "nmsg": notice[4]
            }
            return jsonify(result), 200
        else:
            return jsonify({"message": "No notices found"}), 404
    finally:
        cursor.close()

# Fetch all notices with truncated message
@app.route('/notices-summary', methods=['GET'])
def get_notices_summary():
    cursor = mysql.connection.cursor()
    try:
        cursor.execute("SELECT id, nname, ntype, ndate, LEFT(nmsg, 50) as nmsg_preview FROM notices ORDER BY ndate DESC")
        notices = cursor.fetchall()
        result = [{"id": notice[0], "nname": notice[1], "ntype": notice[2], "ndate": notice[3], "nmsg_preview": notice[4]} for notice in notices]
        return jsonify(result), 200
    finally:
        cursor.close()



# Route to add card data to MySQL
# @app.route('/add_card', methods=['POST'])
# def add_card():
#     data = request.json
#     title = data['title']
#     color = data['color']
#     barValue = data['barValue']
#     value = data['value']
#     png = data['png']
#     series = data['series']

#     cursor = mysql.connection.cursor()
#     query = "INSERT INTO cards (title, color, barValue, value, png, series) VALUES (%s, %s, %s, %s, %s, %s)"
#     cursor.execute(query, (title, color, barValue, value, png, json.dumps(series)))
#     mysql.connection.commit()
#     cursor.close()
#     return jsonify({"message": "Card added successfully"}), 201

# Route to fetch all cards
# @app.route('/cards', methods=['GET'])
# def get_cards():
#     cursor = mysql.connection.cursor()
#     cursor.execute("SELECT * FROM cards")
#     rows = cursor.fetchall()
#     cursor.close()

#     cards = []
#     for row in rows:
#         cards.append({
#             "id": row[0],
#             "title": row[1],
#             "color": row[2],
#             "barValue": row[3],
#             "value": row[4],
#             "png": row[5],
#             "series": json.loads(row[6])
#         })
#     return jsonify(cards)



@app.route('/add_maintenance', methods=['POST'])
def add_maintenance():
    user_name = request.form['user_name']
    flat_number = request.form['flat_number']
    amount_paid = request.form['amount_paid']
    payment_month = request.form['payment_month']  # Expected format: YYYY-MM
    snapshot = request.files['snapshot']

    # Parse payment_month to a full date (e.g., "2024-08" -> "2024-08-01")
    try:
        payment_month_parsed = datetime.strptime(payment_month, "%Y-%m").date()
    except ValueError:
        return jsonify({'error': 'Invalid payment month format'}), 400

    # Save the snapshot if it exists
    filename = None
    if snapshot and allowed_file(snapshot.filename):
        filename = snapshot.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        snapshot.save(file_path)

    # Save to MySQL database
    conn = mysql.connection
    cursor = conn.cursor()
    cursor.execute(
        '''
        INSERT INTO maintenance_records (user_name, flat_number, amount_paid, payment_month, payment_snapshot) 
        VALUES (%s, %s, %s, %s, %s)
        ''',
        (user_name, flat_number, amount_paid, payment_month_parsed, filename)
    )
    conn.commit()
    cursor.close()

    return jsonify({'message': 'Maintenance record added successfully'})

# Get maintenance records for admin
@app.route('/get_maintenance_records', methods=['GET'])
def get_maintenance_records():
    conn = mysql.connection
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM maintenance_records ORDER BY payment_month DESC, payment_date DESC')
    records = cursor.fetchall()

    field_names = [i[0] for i in cursor.description]
    result = [dict(zip(field_names, row)) for row in records]

    cursor.close()
    return jsonify(result)


# Serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

UPLOAD_FOLDER = './static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Check if the file has a valid extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Add new event
@app.route('/addevent', methods=['POST'])
def add_event():
    if 'eimage' not in request.files:
        return jsonify({"success": False, "message": "No image provided"}), 400

    file = request.files['eimage']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        data = request.form
        ename = data.get('ename')
        etype = data.get('etype')
        edate = data.get('edate')
        emsg = data.get('emsg')

        cursor = mysql.connection.cursor()
        try:
            query = "INSERT INTO events (ename, etype, edate, emsg, eimage) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(query, (ename, etype, edate, emsg, filename))
            mysql.connection.commit()
            return jsonify({"success": True, "message": "Event created successfully!"}), 201
        except Exception as e:
            mysql.connection.rollback()
            return jsonify({"success": False, "message": str(e)}), 500
        finally:
            cursor.close()
    else:
        return jsonify({"success": False, "message": "Invalid file type"}), 400

@app.route('/latest-event', methods=['GET'])
def get_latest_event():
    cursor = mysql.connection.cursor()
    try:
        # Fetch the latest event based on the event date
        cursor.execute("SELECT id, ename, etype, edate, emsg, eimage FROM events ORDER BY edate DESC LIMIT 1")
        event = cursor.fetchone()
        if event:
            result = {
                "id": event[0],
                "ename": event[1],
                "etype": event[2],
                "edate": event[3],
                "emsg": event[4],
                "eimage": event[5]
            }
            return jsonify(result), 200
        else:
            return jsonify({"message": "No events found"}), 404
    finally:
        cursor.close()

@app.route('/events-summary', methods=['GET'])
def get_events_summary():
    cursor = mysql.connection.cursor()
    try:
        # Fetch all events except the latest one
        query = """
        SELECT id, ename, etype, edate, LEFT(emsg, 50) AS emsg_preview, eimage 
        FROM events 
        WHERE edate < (SELECT MAX(edate) FROM events)
        ORDER BY edate DESC
        """
        cursor.execute(query)
        events = cursor.fetchall()
        result = [{"id": e[0], "ename": e[1], "etype": e[2], "edate": e[3], "emsg_preview": e[4], "eimage": e[5]} for e in events]
        return jsonify(result), 200
    finally:
        cursor.close()




@app.route('/latest-three-events', methods=['GET'])
def get_latest_three_events():
    cursor = mysql.connection.cursor()
    try:
        query = """
        SELECT ename, LEFT(emsg, 50) AS emsg_preview, edate 
        FROM events 
        ORDER BY edate DESC 
        LIMIT 3
        """
        cursor.execute(query)
        events = cursor.fetchall()
        result = [{"ename": e[0], "emsg_preview": e[1], "edate": e[2]} for e in events]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()

@app.route('/admin/update_flats_maintenance', methods=['POST'])
def update_flats_maintenance():
    data = request.json
    total_flats = data.get('total_flats')
    maintenance_per_flat = data.get('maintenance_per_flat')

    try:
        conn = mysql.connection
        cursor = conn.cursor()

        # Clear existing data
        cursor.execute('DELETE FROM society_summary')

        # Insert new data
        cursor.execute(
            'INSERT INTO society_summary (total_flats, maintenance_per_flat) VALUES (%s, %s)',
            (total_flats, maintenance_per_flat)
        )

        conn.commit()
        cursor.close()
        return jsonify({"message": "Society summary updated successfully."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to fetch society summary for both admin and user
@app.route('/society_summary', methods=['GET'])
def get_society_summary():
    try:
        conn = mysql.connection
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM society_summary LIMIT 1')
        result = cursor.fetchone()

        if result:
            summary = {
                "total_flats": result[0],
                "maintenance_per_flat": result[1]
            }
            return jsonify(summary), 200
        else:
            return jsonify({"message": "No data available"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/maintenance_summary_cards', methods=['GET'])
def maintenance_summary():
    try:
        # Get current month in "YYYY-MM" format
        current_month = datetime.now().strftime("%Y-%m")  # For API use (for calculations)

        # Get the current month's name
        current_month_name = datetime.now().strftime("%B")  # Full month name (e.g., "October")

        conn = mysql.connection
        cursor = conn.cursor()

        # Calculate total maintenance expected for the current month
        cursor.execute('SELECT SUM(maintenance_per_flat * total_flats) FROM society_summary')
        total_maintenance = cursor.fetchone()[0] or 0  # Default to 0 if None

        # Calculate total paid maintenance for the current month
        cursor.execute('SELECT SUM(amount_paid) FROM maintenance_records WHERE DATE_FORMAT(payment_month, "%%Y-%%m") = %s', (current_month,))
        paid_maintenance = cursor.fetchone()[0] or 0  # Default to 0 if None

        # Calculate pending maintenance for the current month
        pending_maintenance = total_maintenance - paid_maintenance

        cursor.close()

        summary = {
            "total_maintenance": total_maintenance,
            "paid_maintenance": paid_maintenance,
            "pending_maintenance": pending_maintenance,
            "current_month": current_month_name  # Use the full month name
        }

        return jsonify(summary), 200

    except Exception as e:
        # Log the full error traceback to the server console
        import traceback
        print("Error:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
