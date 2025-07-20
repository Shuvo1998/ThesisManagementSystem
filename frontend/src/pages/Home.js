// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../styles/Home.css'; // নিশ্চিত করুন এই ফাইলটি আছে

// ডিপার্টমেন্টের তথ্য (আপনার প্রয়োজন অনুযায়ী আপডেট করুন)
const departmentInfo = {
    name: "Computer Science and Engineering (CSE)",
    university: "Your University Name", // আপনার বিশ্ববিদ্যালয়ের নাম যোগ করুন
    tagline: "Unlocking Knowledge, Fostering Innovation.",
    description: "The Department of Computer Science and Engineering is a vibrant hub for academic excellence and groundbreaking research. We are committed to providing a comprehensive education that equips students with the skills to tackle complex technological challenges and contribute to a better future. Our thesis repository serves as a testament to the intellectual endeavors of our students and faculty, showcasing cutting-edge research across various domains.",
    heroImageUrl: "https://images.unsplash.com/photo-1542831371-d249d63ec253?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // একটি আকর্ষণীয় কোড/টেকনোলজি ব্যাকগ্রাউন্ড
    // featuredImageUrl: "https://scontent.fdac90-1.fna.fbcdn.net/v/t39.30808-6/459046424_122095793150521811_5715213249718928759_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEWMrMbyVuoakO5MYFC5qAlNgDDXZ3iz_82AMNdneLP_083OPPC1fcHNag6tOdKQsTjkxMY2_GisUDQ5DiI3alD&_nc_ohc=UH6_7GLsN70Q6x48jXo&_nc_oc=AdmXgNGIc9bsVg1Ktf5zQU4r5eJn06wXMD0KjyRiPY_rej7n2VncpPMJsscpYyIJ9ik&_nc_zt=23&_nc_ht=scontent.fdac90-1.fna&_nc_gid=llSEYakWitmdMJT5YOLS3Q&oh=00_AfQBD6Vz2cfLEUvjBLsC9z8RcsH7o_HgJvL397eXCLllUA&oe=6880A1FE", // ডিপার্টমেন্টের কোনো ছবি বা প্রতীকী ছবি
};

function Home() {
    const [theses, setTheses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [featuredTheses, setFeaturedTheses] = useState([]); // নতুন স্টেট: ফিচারড থিসিসের জন্য

    // ফিচারড থিসিস লোড করার জন্য useEffect
    useEffect(() => {
        const fetchFeaturedTheses = async () => {
            try {
                // এখানে আপনি আপনার Backend থেকে কিছু "ফিচারড" থিসিস লোড করতে পারেন।
                // উদাহরণস্বরূপ, সর্বশেষ কিছু আপলোড হওয়া/অ্যাপ্রুভড থিসিস।
                // অথবা একটি নতুন API এন্ডপয়েন্ট তৈরি করতে পারেন যেমন /api/theses/featured
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/theses`);
                // প্রথম ৪-৬টি থিসিস দেখানোর জন্য (আপনার প্রয়োজন অনুযায়ী সংখ্যা পরিবর্তন করুন)
                setFeaturedTheses(response.data.slice(0, 4)); 
            } catch (err) {
                console.error("Error fetching featured theses:", err);
            }
        };
        fetchFeaturedTheses();
    }, []);

    const handleSemanticSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            setTheses([]);
            setSearchPerformed(false);
            return;
        }

        setLoading(true);
        setError(null);
        setSearchPerformed(true);

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/theses/semantic-search`, {
                params: { query: searchQuery }
            });
            setTheses(response.data);
        } catch (err) {
            console.error('Error during semantic search:', err);
            setError('Failed to fetch semantic search results. Please ensure the AI service is running and try again.');
            setTheses([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <header className="hero-section" style={{ backgroundImage: `url(${departmentInfo.heroImageUrl})` }}>
                <div className="hero-overlay"></div>
                <Container className="hero-content text-center text-white">
                    <h1 className="display-3 fw-bold mb-3 animate__animated animate__fadeInDown">
                        Welcome to the <br /> {departmentInfo.name} Thesis Repository
                    </h1>
                    <p className="lead mb-4 animate__animated animate__fadeInUp animate__delay-1s">
                        {departmentInfo.tagline}
                    </p>
                    <div className="d-flex justify-content-center flex-wrap gap-3 animate__animated animate__fadeInUp animate__delay-2s">
                        <Button as={Link} to="/dashboard" variant="primary" size="lg" className="hero-button">
                            Explore All Theses
                        </Button>
                        <Button as={Link} to="/upload-thesis" variant="outline-light" size="lg" className="hero-button">
                            Upload Your Thesis
                        </Button>
                    </div>
                </Container>
            </header>

            {/* Semantic Search Section */}
            <section className="semantic-search-section py-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={10} lg={8}>
                            <Card className="p-4 shadow-lg border-0 bg-white search-card animate__animated animate__fadeIn">
                                <h2 className="text-center mb-4 text-primary fw-bold">AI-Powered Thesis Search</h2>
                                <Form onSubmit={handleSemanticSearch} className="mb-4">
                                    <Form.Group className="d-flex flex-column flex-sm-row">
                                        <Form.Control
                                            type="text"
                                            placeholder="Search for theses using AI (e.g., 'deep learning for medical image analysis')"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="me-sm-2 mb-2 mb-sm-0 search-input"
                                        />
                                        <Button variant="dark" type="submit" disabled={loading} className="search-button">
                                            {loading ? <Spinner animation="border" size="sm" /> : 'Semantic Search'}
                                        </Button>
                                    </Form.Group>
                                </Form>

                                {/* Search Results Display */}
                                {searchPerformed && (
                                    <div className="search-results-container mt-4">
                                        {loading && <p className="text-center text-muted">Loading search results...</p>}
                                        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                                        {!loading && !error && (
                                            theses.length > 0 ? (
                                                <div className="theses-results">
                                                    <h4 className="mb-3 text-secondary">Results for "{searchQuery}"</h4>
                                                    {theses.map((thesis) => (
                                                        <Card key={thesis._id} className="mb-3 result-card animate__animated animate__fadeInUp">
                                                            <Card.Body>
                                                                <Card.Title className="text-info">{thesis.title}</Card.Title>
                                                                <Card.Subtitle className="mb-2 text-muted">By {thesis.author} ({thesis.publicationYear})</Card.Subtitle>
                                                                <Card.Text>
                                                                    {thesis.abstract ? thesis.abstract.substring(0, 250) + '...' : 'No abstract available.'}
                                                                </Card.Text>
                                                                {thesis.similarityScore && (
                                                                    <p className="card-text"><small className="text-muted">Similarity: {thesis.similarityScore.toFixed(4)}</small></p>
                                                                )}
                                                                {/* Optional: Add a link to view full thesis details if you have such a page */}
                                                                {/* <Link to={`/thesis/${thesis._id}`} className="btn btn-sm btn-outline-primary">View Details</Link> */}
                                                            </Card.Body>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center text-muted">No semantic search results found for "{searchQuery}". Try a different query.</p>
                                            )
                                        )}
                                    </div>
                                )}
                                {!searchPerformed && !loading && !error && (
                                    <p className="text-center mt-4 text-muted">Enter a query above to explore theses using AI-powered semantic search.</p>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* About Department Section */}
            <section className="about-section py-5 bg-light">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6} className="text-center mb-4 mb-md-0">
                            <img
                                src="https://images.unsplash.com/photo-1550978937-293026744c82?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // ডিপার্টমেন্টের যেকোনো ছবি বা প্রতীকী ছবি
                                alt={departmentInfo.name}
                                className="img-fluid rounded shadow-lg about-image animate__animated animate__zoomIn"
                            />
                        </Col>
                        <Col md={6}>
                            <h2 className="mb-3 animate__animated animate__fadeInRight animate__delay-1s">About {departmentInfo.name}</h2>
                            <p className="lead text-muted animate__animated animate__fadeInRight animate__delay-2s">
                                {departmentInfo.description}
                            </p>
                            <Button as={Link} to="/about" variant="outline-dark" className="mt-3 animate__animated animate__fadeInUp animate__delay-3s">
                                Learn More About Us
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Featured Theses Section (নতুন যোগ করা হয়েছে) */}
            <section className="featured-theses-section py-5">
                <Container>
                    <h2 className="text-center mb-5 text-dark fw-bold animate__animated animate__fadeInDown">Featured Theses</h2>
                    {featuredTheses.length > 0 ? (
                        <Row>
                            {featuredTheses.map((thesis) => (
                                <Col md={6} lg={3} key={thesis._id} className="mb-4">
                                    <Card className="h-100 featured-thesis-card shadow-sm animate__animated animate__fadeInUp">
                                        <Card.Body>
                                            <Card.Title className="text-primary">{thesis.title}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">By {thesis.author}</Card.Subtitle>
                                            <Card.Text className="text-truncate" style={{ height: '3.5em' }}>{thesis.abstract}</Card.Text> {/* টেক্সট ট্রাঙ্কেট করা হলো */}
                                            <p className="text-muted small">Year: {thesis.publicationYear}</p>
                                            <Link to={`/thesis/${thesis._id}`} className="btn btn-sm btn-outline-primary">View Details</Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p className="text-center text-muted">No featured theses available at the moment. Please check back later!</p>
                    )}
                </Container>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section bg-primary text-white py-5 text-center">
                <Container>
                    <h2 className="mb-3 animate__animated animate__fadeInDown">Ready to Explore More?</h2>
                    <p className="lead mb-4 animate__animated animate__fadeInUp animate__delay-1s">
                        Dive deeper into the vast collection of academic work.
                    </p>
                    <div className="animate__animated animate__fadeInUp animate__delay-2s">
                        <Button as={Link} to="/dashboard" variant="light" size="lg" className="me-3">
                            Browse All Theses
                        </Button>
                        <Button as={Link} to="/upload-thesis" variant="outline-light" size="lg">
                            Submit Your Work
                        </Button>
                    </div>
                </Container>
            </section>
        </div>
    );
}

export default Home;