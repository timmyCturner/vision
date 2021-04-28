import React, { Component } from "react";

class Header extends Component {
    render() {
        return (
            <section id="banner">
                <div className="inner">
                    <h2>[project title]</h2>
                    <p>
                        [project motto]
                    </p>
                </div>
            </section>
        );
    }
}

export default Header;
