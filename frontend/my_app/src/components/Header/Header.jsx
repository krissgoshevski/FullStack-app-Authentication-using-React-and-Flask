import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
import './Header.css'

function Header(props) {

    const navigate = useNavigate();

    function logout() {
        fetch({
            method: 'POST',
            url: 'http://127.0.0.1:5000/logout',
        }).then((response) => {
            props.token()
            localStorage.removeItem('email');
            navigate('/login');
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })

    }

    const loggedIn = localStorage.getItem('email');

    return (
        <>
            {['xl'].map((expand) => (
                <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
                    <Container fluid>
                        <div className="mt-3">
                            <img
                                src={process.env.PUBLIC_URL + '/../../assets/r-f.png'}
                                alt="Flask React Logo"
                                className="react-flask-logo"

                            />

                        </div>
                        <Navbar.Brand href="#">Home</Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                    Offcanvas
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Nav.Link href="/user/details"> Profile </Nav.Link>
                                    <Nav.Link href="#action2"> Create </Nav.Link>
                                </Nav>
                                <Form className="d-flex">
                                    <Form.Control
                                        type="search"
                                        placeholder="Search"
                                        className="ms-1"
                                        aria-label="Search"
                                    />
                                    <Button variant="outline-success" className="ms-5">Search</Button>
                                </Form>


                                <Button
                                    variant="outline-primary"
                                    className="ms-5"
                                    onClick={logout}
                                >
                                    Logout
                                </Button>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar >
            ))
            }
        </>
    );
}

export default Header;
