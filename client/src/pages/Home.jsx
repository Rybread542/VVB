import "../styles/home.css"

export function Home() {
    return (
        <main className = 'home-main'>
            <div className="home-hero">
                <div className="home-hero-title">
                    <h1 className="hero-title-text">Vinyl & Vanilla Bakery</h1>
                </div>
                
                <div className="home-hero-buttons">
                    <a href="/menu">
                        <button className="home-button">
                            Menu
                        </button>
                    </a>

                    <a href="/store">
                        <button className="home-button">
                            Order Delivery
                        </button>
                    </a>
                </div>
            </div>

            <section className="home-about">
                <div className="home-about-card">
                    <div className="about-card-motif">
                        <img src="images/motif-cookie-t.png" alt="" />
                    </div>
                    <div className="about-card-info">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, sint.</p>
                    </div>
                </div>

                <div className="home-about-card">
                    <div className="about-card-motif">
                        <img src="images/motif-record-t.png" alt="" />
                    </div>
                    <div className="about-card-info">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores debitis id laudantium ab illo sint.</p>
                    </div>
                </div>

                <div className="home-about-card">
                    <div className="about-card-motif">
                        <img src="images/motif-pie-t.png" alt="" />
                    </div>
                    <div className="about-card-info">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                    </div>
                </div>

            </section>

            <section className="home-delivery-info">
                <div className="delivery-info-text">
                    <h2>Lorem, Ipsum!</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo natus at qui a accusantium, ducimus explicabo! Cum repudiandae dicta reiciendis eos et quisquam minima id.</p>
                </div>
            </section>

            <section className="home-gallery">

                <div className="product-photo">
                    <img src="images/gallery-cookie.png" alt="" />
                </div>

                <div className="product-photo">
                    <img src="images/gallery-brownie.png" alt="" />
                </div>

                <div className="product-photo">
                    <img src="images/gallery-banana-bread.png" alt="" />
                </div>

                <div className="product-photo">
                    <img src="images/gallery-cookie2.png" alt="" />
                </div>

            </section>
        </main>   
    )
}