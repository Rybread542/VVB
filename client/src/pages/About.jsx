import '../styles/about.css'

export function About() {
    return (
        <main className="about-main">
            <div className="about-info">
                <div className="about-info-header">
                    <h1>Lorem ipsum dolor sit.</h1>
                </div>
                <div className="about-info-text">
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda, dignissimos eos accusantium cumque magni saepe dolorem adipisci similique itaque, nobis ea illo ut esse. Deleniti sit voluptates aperiam.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod quia corrupti expedita.</p>
                </div>
            </div>
            <div className="about-photo">
                <img src="images/about-img.png" alt="" />
            </div>
        </main>
    )
}