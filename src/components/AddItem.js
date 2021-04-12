import React, { Component } from 'react';

class AddItem extends Component {
    constructor() {
        super();

        this.state = {
            showMenu: false,
        };

        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    showMenu(event) {
        event.preventDefault();

        this.setState({ showMenu: true }, () => {
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeMenu(event) {

        if (!this.dropdownMenu.contains(event.target)) {

            this.setState({ showMenu: false }, () => {
                document.removeEventListener('click', this.closeMenu);
            });

        }
    }

    render() {
        return (
            <div>
                <div className={'addItemButton'} onClick={this.showMenu}>
                    <p>+</p>
                </div>

                {
                    this.state.showMenu
                        ? (
                            <div className={'addItemMenu'}>
                                <ul
                                    className="menu list"
                                    ref={(element) => {
                                        this.dropdownMenu = element;
                                    }}
                                >
                                    <li>Add an Option Trade</li>
                                    <li>Add an Underlying Trade</li>
                                    <li>Add a Banking Transaction</li>
                                </ul>
                        </div>
                        )
                        : (
                            null
                        )
                }
            </div>
        );
    }
}

export default AddItem;