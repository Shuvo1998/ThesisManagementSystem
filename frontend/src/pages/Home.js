// frontend/src/pages/Home.js
// frontend/src/pages/Home.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'; // <<< এই লাইনটি যোগ করুন
import { Link } from 'react-router-dom'; // <<< এই লাইনটি যোগ করুন
//import '../styles/Home.css'; // এই CSS ফাইলটি আমরা পরে তৈরি করব

// তোমার ডিপার্টমেন্টের তথ্য
const departmentInfo = {
  name: "Computer Science and Engineering (CSE)", // তোমার ডিপার্টমেন্টের নাম
  tagline: "Innovating the Future of Technology", // একটি আকর্ষণীয় ট্যাগলাইন
  description: "The Department of Computer Science and Engineering is dedicated to providing high-quality education and research opportunities in various fields of computing. Our aim is to foster innovation and prepare students for the challenges of the modern tech world.",
  imageUrl: "https://scontent.fdac90-1.fna.fbcdn.net/v/t39.30808-6/459046424_122095793150521811_5715213249718928759_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEWMrKbyVuoakO5MYFC5qAlNgDDXZ3iz_82AMNdneLP_083OPPC1fcHNag6tOdKQsTjkxMY2_GisUDQ5DiI3alD&_nc_ohc=UH6_7GLsN70Q7kNvwFwzvk8&_nc_oc=AdmXgNGIc9bsVg1Ktf5zQU4r5eJn06wXMD0KjyRiPY_rej7n2VncpPMJsscpYyIJ9ik&_nc_zt=23&_nc_ht=scontent.fdac90-1.fna&_nc_gid=llSEYakWitmdMJT5YOLS3Q&oh=00_AfQBD6Vz2cfLEUvjBLsC9z8RcsH7o_HgJvL397eXCLllUA&oe=6880A1FE", // ডিপার্টমেন্টের কোনো ছবি বা প্রতীকী ছবি
  // তুমি এখানে তোমার ডিপার্টমেন্টের আসল ছবির URL দিতে পারো
  // উদাহরণ: "https://your-website.com/images/cse-department.jpg"
};

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <Container fluid className="hero-section text-center d-flex align-items-center justify-content-center">
        <div className="overlay"></div> {/* Overlay for better text readability */}
        <Row className="justify-content-center align-items-center text-white text-shadow-lg">
          <Col md={10} lg={8}>
            <h1 className="display-4 mb-3 animate__animated animate__fadeInDown">
              Welcome to the Thesis Hub of <br /> {departmentInfo.name}
            </h1>
            <p className="lead mb-4 animate__animated animate__fadeInUp animate__delay-2s">
              {departmentInfo.tagline}
            </p>
            <div className="animate__animated animate__fadeInUp animate__delay-3s">
              <Button as={Link} to="/dashboard" variant="primary" size="lg" className="me-3">
                Explore Theses
              </Button>
              <Button as={Link} to="/register" variant="outline-light" size="lg">
                Join Us
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* About Department Section */}
      <Container className="about-section my-5">
        <Row className="align-items-center">
          <Col md={6} className="text-center mb-4 mb-md-0">
            <img 
              src={departmentInfo.imageUrl} 
              alt={departmentInfo.name} 
              className="img-fluid rounded shadow-lg animate__animated animate__zoomIn"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Col>
          <Col md={6}>
            <h2 className="mb-3 animate__animated animate__fadeInRight animate__delay-1s">About Our Department</h2>
            <p className="lead animate__animated animate__fadeInRight animate__delay-2s">
              {departmentInfo.description}
            </p>
            {/* এখানে পরে থিসিস ডিসপ্লে এবং সার্চ বার যোগ হবে */}
          </Col>
        </Row>
      </Container>

      {/* Optional: Add more sections if needed */}
    </div>
  );
}

export default Home;