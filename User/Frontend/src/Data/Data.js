// Sidebar imports
import {
  UilEstate,
  UilClipboardAlt,
  UilPackage,
  UilChart,
  UilCalendarAlt,
  UilBell,
  UilMoneyBill,
  
} from "@iconscout/react-unicons";

// Analytics Cards imports
import { UilUsdSquare, UilMoneyWithdrawal } from "@iconscout/react-unicons";
import { keyboard } from "@testing-library/user-event/dist/keyboard";

// Recent Card Imports
import img1 from "../imgs/img1.png";
import img2 from "../imgs/img2.png";
import img3 from "../imgs/img3.png";

// Sidebar Data
export const SidebarData = [
  {
    icon: UilEstate,
    heading: "Dashboard",
    path: "/maindash",
    roles: ["admin", "user"]
  },
  {
    icon: UilClipboardAlt,
    heading: "Flats",
    path: "/Flats", 
    roles: [ "user"]
  },
  {
    icon: UilClipboardAlt,
    heading: "Flats",
    path: "/AdFlats", 
    roles: ["admin"]
  },
  
  {
    icon: UilPackage,
    heading: 'Maintainance',
    path: "/addmaintainance",
    roles: [ "user"]
  },
  {
    icon: UilPackage,
    heading: 'View Maintainance',
    path: "/viewmaintenance",
    roles: [ "admin"]
  },
  {
    icon: UilChart,
    heading: 'Register Complaint',
    path: "/registercomplaintform",
    roles: [ "user"]
  },
  {
    icon: UilChart,
    heading: 'View Complaints',
    path: "/registercomplaints",
    roles: [ "admin"]
  },
  {
    icon: UilCalendarAlt,
    heading: "Event",
    path: "/addevent",
    roles: ["admin" ]
  },
  {
    icon: UilCalendarAlt,
    heading: "Event",
    path: "/eventspage",
    roles: ["user" ]
  },
  {
    icon: UilBell,
    heading: "Add Notice",
    path: "/addnotice",
    roles: ["admin" ]
  },
  {
    icon: UilBell,
    heading: "View Notices",
    path: "/noticespage",
    roles: ["user" ]
  },
  {
    icon: UilMoneyBill,
    heading: "Register User",
    path: "/register",
    roles: ["admin"]
  },
  {
    icon: UilMoneyBill,
    heading: "Register Admin",
    path: "/admin/register",
    roles: ["admin"]
  },
];

// Analytics Cards Data
export const cardsData = [
  {
    title: "Overall Maintainance",
    color: {
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "1,32,345",
    png: UilUsdSquare,
    series: [
      {
        name: "xxxx",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
  {
    title: "Total Paid",
    color: {
      backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
      boxShadow: "0px 10px 20px 0px #FDC0C7",
    },
    barValue: 80,
    value: "95,987",
    png: UilMoneyWithdrawal,
    series: [
      {
        name: "YYYY",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Pending",
    color: {
      backGround:
        "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
      boxShadow: "0px 10px 20px 0px #F9D59B",
    },
    barValue: 60,
    value: "36,358",
    png: UilClipboardAlt,
    series: [
      {
        name: "ZZZZZ",
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
];




// // Society Related Notifications
export const SocietyNotifications = [
  {
    img: img1, // You can replace this with actual profile images or icons
    name: "Mr. Sharma",
    noti: "has registered a complaint about water leakage in his flat.",
    time: "10 minutes ago",
  },
  {
    img: img2,
    name: "Mrs. Gupta",
    noti: "has received her electricity bill for the month of September.",
    time: "1 hour ago",
  },
  {
    img: img3,
    name: "Security Team",
    noti: "has logged the entry of a visitor in Block A.",
    time: "2 hours ago",
  },
 
];

// Society Related Events
// export const SocietyEvents = [
//   {
//     img: img1, // Replace with event-related icons or images
//     name: "Annual General Meeting",
//     noti: "The Annual General Meeting for society members will be held in the community hall.",
//     time: "25th October 2024, 5:00 PM",
//   },
//   {
//     img: img2,
//     name: "Diwali Celebration",
//     noti: "Join the society for Diwali celebrations at the central park. Fireworks and sweets will be provided.",
//     time: "12th November 2024, 7:00 PM",
//   },
//   {
//     img: img3,
//     name: "Cleanliness Drive",
//     noti: "The society's cleanliness drive will take place this weekend. Volunteers are requested to gather at the main gate.",
//     time: "18th November 2024, 9:00 AM",
//   },
 
// ];
