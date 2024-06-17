import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card,CardGroup, Button } from 'react-bootstrap';
import "./EditName.scss"

const EditName = () => {
  const initialValues = {
    fullName: '',
    phoneNumber: '',
    email: 'duonghaingu@gmail.com',  // Example email, replace with actual data
    facebook: ''
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Required'),
    phoneNumber: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    facebook: Yup.string().url('Invalid URL format')
  });

  const onSubmit = values => {
    console.log(values);
    // Add your submit logic here
  };

  return (
    <Container>
      <Card className="mt-5">
        <Card.Header>
          <h2>Chỉnh sửa thông tin</h2>
        </Card.Header>
        <Card.Body>
          <CardGroup>
            <Card className="mb-3">
              <Card.Body>
                <h3>Account: halinhtvn3a</h3>
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {formik => (
                    <Form>
                      <Row>
                        <Col md={6}>
                          <div className="form-group">
                            <label htmlFor="fullName">Họ và tên</label>
                            <Field
                              type="text"
                              id="fullName"
                              name="fullName"
                              className="form-control"
                            />
                            <ErrorMessage name="fullName" component="div" className="text-danger" />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="form-group">
                            <label htmlFor="phoneNumber">Số điện thoại</label>
                            <Field
                              type="text"
                              id="phoneNumber"
                              name="phoneNumber"
                              className="form-control"
                            />
                            <ErrorMessage name="phoneNumber" component="div" className="text-danger" />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Field
                              type="email"
                              id="email"
                              name="email"
                              className="form-control"
                              disabled
                            />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="form-group">
                            <label htmlFor="facebook">Facebook</label>
                            <Field
                              type="text"
                              id="facebook"
                              name="facebook"
                              className="form-control"
                            />
                            <ErrorMessage name="facebook" component="div" className="text-danger" />
                          </div>
                        </Col>
                      </Row>
                      <Button type="submit" className="mt-3">Cập nhật</Button>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </CardGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditName;
