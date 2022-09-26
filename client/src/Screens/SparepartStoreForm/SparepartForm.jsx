
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useForm } from "react-hook-form";
import './SparepartForm.css';
import { useEffect, useState } from 'react';
import { apiEndpoint } from '../../config';

const SparepartForm = ({ auth }) => {

  const [items, setItems] = useState([]);
  const [accType, setAccType] = useState('ADD');
  const token = auth.getIdToken();
  const {
    register,
    reset,
    setValue,
    handleSubmit,
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      description: '',
      inStock: '',
      vendor: '',
      vendorPartNum: ''
    }
  });

  const onCancel = () => {
    reset();
  }

  const getParts = async (tk) => {
    const response = await axios.get(`${apiEndpoint}/parts`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tk}`
      },
    })
    setItems(response.data.items);
    reset();
  }
  const createParts = async (body, tk) => {
    const response = await axios.post(`${apiEndpoint}/parts`, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tk}`
      }
    })
    if (response.status !== 201) {
      return;
    }
    getParts(token);
  }
  useEffect(() => {
    getParts(token);
  }, [])


  // Update parts
  const updateParts = async (tk, partId, body) => {
    await axios.patch(`${apiEndpoint}/parts/${partId}`, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tk}`
      }
    })
    getParts(token);
    reset();
    setAccType('ADD');
  }

  const updatePart = (itemPart) => {
    setAccType('UPDATE');
    setValue('description', itemPart.description)
    setValue('inStock', itemPart.inStock)
    setValue('vendor', itemPart.vendor)
    setValue('vendorPartNum', itemPart.vendorPartNum)
    setValue('partNum', itemPart.partNum)
  }

  const onSubmit = (item) => {
    if (item) {
      if (accType === 'ADD') {
        console.log('ADD')
        createParts({
          description: item.description,
          vendor: item.vendor,
          vendorPartNum: item.vendorPartNum,
          inStock: parseInt(item.inStock)
        }, token)
      } else if (accType === 'UPDATE') {
        console.log('UPDATE')

        updateParts(
          token,
          item.partNum,
          { description: item.description, inStock: parseInt(item.inStock) }
        )
      }


    }
  };

  // Delete part
  const deletePart = async (tk, partId) => {
    const res = await axios.delete(`${apiEndpoint}/parts/${partId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tk}`
      }
    })
    getParts(token);
  }

  const removePart = (partId) => {
    if (partId) {
      deletePart(token, partId);
    }
  }

  // Upload image for part

  const getUploadUrl = async (tk, partId) => {
    const response = await axios.post(`${apiEndpoint}/parts/${partId}/attachment`, '', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tk}`
      }
    })
    return response.data.uploadUrl;
  }

  const uploadFile = async (uploadUrl, file) => {
    const res = await axios.put(uploadUrl, file);
    if (res.status === 200) {
      getParts(token);
    }
  }

  const uploadImagePart = async (e, partId) => {
    const file = e.target.files[0];
    console.log(file)
    const uploadUrl = await getUploadUrl(token, partId);
    await uploadFile(uploadUrl, file);
  }

  return (
    <Row>
      <Col xs={8} className='sparepart-form'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col xs={6}>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  {...register("description")}
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-3" controlId="inStock">
                <Form.Label>InStock</Form.Label>
                <Form.Control
                  type="text"
                  {...register("inStock")}
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-3" controlId="vendor">
                <Form.Label>Vendor</Form.Label>
                <Form.Control
                  disabled={accType === 'UPDATE'}
                  type="text"
                  {...register("vendor")}
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-3" controlId="vendorPartNum">
                <Form.Label>VendorPartNum</Form.Label>
                <Form.Control
                  disabled={accType === 'UPDATE'}
                  type="text"
                  {...register("vendorPartNum")}
                />
              </Form.Group>
            </Col>
            {accType !== 'ADD' && <Col xs={6}>
              <Form.Group className="mb-3" controlId="partNum">
                <Form.Label>PartNum</Form.Label>
                <Form.Control
                  disabled={accType === 'UPDATE'}
                  type="text"
                  {...register("partNum")}
                />
              </Form.Group>
            </Col>}
          </Row>
          <Row>
            <Col>
              <Button variant="success" className='mx-4' onClick={onCancel}>Cancel</Button>
              <Button variant="success" className='mx-4' type='submit'>Register</Button>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col xs={12}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th className='text-center p-3'>Description</th>
              <th className='text-center p-3'>InStock</th>
              <th className='text-center p-3'>Vendor</th>
              <th className='text-center p-3'>VendorPartNum</th>
              <th className='text-center p-3'>PartNum</th>
              <th className='text-center p-3'>Image</th>
              <th className='text-center p-3'>Actions</th>
              <th className='text-center p-3'>Upload Part</th>
            </tr>
          </thead>
          <tbody>
            {
              items.map((val, idx) => {
                return (
                  <tr key={idx}>
                    <td>{val.description}</td>
                    <td>{val.inStock}</td>
                    <td>{val.vendor}</td>
                    <td>{val.vendorPartNum}</td>
                    <td>{val.partNum}</td>
                    <td className='img-styles'>
                      <img src={val.attachmentUrl} alt='No Image' />

                    </td>
                    <td>
                      <Button variant="success" className='mx-4' type='submit' onClick={() => updatePart(val)} >Update</Button>
                      <Button variant="success" className='mx-4' type='submit' onClick={() => removePart(val.partNum)}>Delete</Button>
                    </td>
                    <td>
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Control type="file" accept='image/*' onChange={(e) => uploadImagePart(e, val.partNum)} />
                      </Form.Group>
                    </td>

                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </Col>
    </Row>

  )
}

export default SparepartForm;