import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'

const DashboardPage = () => {
    return (
        <>
            <div className='col text-align-left'>
                <Card>
                    <Card.Header>
                        <Row>
                            <Col className='d-flex justify-content-start'>
                                Dashboard Page
                            </Col>
                            <Col className='d-flex justify-content-end'>
                                <Button variant='outline-primary' onClick={() => {}}>
                                    Create New
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>
                </Card>
            </div>
        </>
    )
}

export default DashboardPage