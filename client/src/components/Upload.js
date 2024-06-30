import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert, InputGroup, FormControl } from 'react-bootstrap';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [downloadLink, setDownloadLink] = useState('');

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://13.232.10.159:8080/api/files/upload', formData);
            setMessage(response.data.message);
            setDownloadLink(response.data.downloadLink);
        } catch (error) {
            setMessage('Failed to upload file');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(downloadLink);
        alert('Download link copied to clipboard');
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Ebhoom Over the Air Update</h1>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Upload PEM File</Form.Label>
                            <Form.Control type="file" onChange={onFileChange} />
                        </Form.Group>
                        <Button variant="primary" onClick={onFileUpload} className="w-100">
                            Upload
                        </Button>
                    </Form>
                    {message && (
                        <Alert variant="info" className="mt-3">
                            {message}
                        </Alert>
                    )}
                    {downloadLink && (
                        <InputGroup className="mt-3">
                            <FormControl
                                value={downloadLink}
                                readOnly
                            />
                            <Button variant="outline-secondary" onClick={copyToClipboard}>
                                <i className="bi bi-clipboard"></i>
                            </Button>
                        </InputGroup>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Upload;
