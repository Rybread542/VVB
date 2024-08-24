import {Routes, Route} from "react-router-dom"
import { Home } from './pages/Home'
import { Store } from './pages/Store'
import { Menu } from './pages/Menu'
import { Checkout } from './pages/Checkout'
import { CheckoutSuccess } from "./pages/Checkout-Success"
import { CheckoutCanceled } from "./pages/Checkout-Canceled"
import { NotFound } from "./pages/404"
import { Navbar } from './components/page/nav'
import { CartProvider } from "./context/CartContext"
import { DataProvider } from "./context/ProductDataContext"
import { Cart } from "./pages/Cart"
import { About } from "./pages/About"
import { Contact } from "./pages/Contact"
import { Footer } from "./components/page/footer"

function App() {

  return (
    <>
  <DataProvider>
    <CartProvider>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/menu' element={<Menu />} />
      <Route path='/store' element={<Store />} />
      <Route path='/checkout' element={<Checkout />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/about' element={<About />} />
      <Route path='/checkout-success' element={<CheckoutSuccess />} />
      <Route path='/checkout-cancel' element={<CheckoutCanceled />}/>
      <Route path='/404' element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer/>
    </CartProvider>
  </DataProvider>
    </>
  )
}

export default App
