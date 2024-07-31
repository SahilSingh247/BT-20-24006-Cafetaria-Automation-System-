//importing css
import './App.css';

//importing router
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route} from 'react-router-dom';

//importing pages
import SignIn from './signIn_signUp/sign_in.js';
import SignUp from './signIn_signUp/sign_up.js';
import RootLayout from './rootLayout.js';
import HomePage from './custom_compo/homepage.js';
import Feedback from './custom_compo/feedback.js';
import AboutUs from './custom_compo/aboutus.js';
import Contact from './custom_compo/contact.js';
import Error from './custom_compo/error.js';
import Canteens from './custom_compo/canteens.js';
import S_Canteen from './custom_compo/s_canteens.js';
import S_Home from './custom_compo/s_home.js';
import Menu from './custom_compo/menu.js';
import CownerHome from './custom_compo/cownerHome.js';
import PendingOrders from './custom_compo/pendingOrders';
import AllOrders from './custom_compo/allOrders';
import FeedbackCanteen from './custom_compo/feedbackCanteen.js';
import PendingOrderCust from './custom_compo/pendingOrderCust.js';
import AllOrderCust from './custom_compo/allOrderCust.js';
import Unauthorised from './custom_compo/unauthorisedpage.js'
import Stats from './custom_compo/stats.js'
//<Route path='/home/aboutUs' element={<AboutUs/>}/>
//<Route path='/home/contact' element={<Contact/>}/>
//creating routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout/>}>
      <Route index element={<SignIn/>}/>
      <Route path="/sign_up" element={<SignUp/>}/>
      <Route path='/home' element={<HomePage/>}/>
      <Route path='/home/feedback' element={<Feedback/>}/>
      <Route path='/home/canteens' element={<Canteens/>}/>
      <Route path='/home/canteens/:id' element={<Menu/>}/> {/* Left */}
      <Route path='/home/pendingOrders' element={<PendingOrderCust/>}/>
      <Route path='/home/allOrders' element={<AllOrderCust/>}/>
      <Route path='/S_home' element={<S_Home/>}/>
      <Route path="/S_home/S_canteens" element={<S_Canteen/>}/>
      <Route path='/cownerHome/:id' element={<CownerHome/>}/>
      <Route path='/cownerHome/stats/:id' element={<Stats/>}/>
      <Route path='/cownerHome/pendingOrders/:id' element={<PendingOrders/>}/>
      <Route path='/cownerHome/allOrders/:id' element={<AllOrders/>}/>
      <Route path='/cownerHome/feedbackCanteen/:id' element={<FeedbackCanteen/>}/>
      <Route path='/unauth' element={<Unauthorised/>}/>
      <Route path='*' element={<Error/>}/>
    </Route>
  )
)

function App() {
  return (
    // showing route
    <RouterProvider router={router}/>
  );
}

export default App;