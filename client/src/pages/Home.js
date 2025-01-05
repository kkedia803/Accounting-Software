import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Main from '../components/Main'
import FAQ from '../components/FAQ'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

const Home = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <Main />
            <FAQ />
            <Testimonials />
            <Footer />
        </div>
    )
}

export default Home