import React, { useEffect } from "react";
import { Card, Col, Form, Row, Button, InputGroup } from "react-bootstrap";
import { useState } from "react";
import InvoiceItem from "./reusable/billingitem";
import BillingModal from "./reusable/billmodal";

function BillingForm() {
  const [state, setState] = useState({
    isOpen: false,
    currency: "₹",
    currentDate: "",
    billingNumber: 1,
    billTo: "",
    billToAddress: "",
    billToEmail: "",
    billFrom: "KS Groups",
    billFromEmail: "Ksgrp@gmail.com",
    billFromAddress: "Chennai, TamilNadu",
    notes: "",
    subTotal: "0.00",
    GSTRate: 0,
    GSTAmount: "0.00",
    discountRate: 0,
    discountAmount: "0.00",
  });

  const [total, setTotal] = useState(0.0);
  const [items, setItems] = useState([
    {
      id: "0",
      name: "",
      description: "",
      price: 1.0,
      quantity: 1,
    },
  ]);

  const onChange = (event) => {
    setState((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  const onItemizedItemEdit = (event) => {
    const individualItem = {
      id: event.target.id,
      name: event.target.name,
      value: event.target.value,
    };

    var newItems = items.map((item) => {
      for (var key in item) {
        if (key === individualItem.name && item.id === individualItem.id) {
          item[key] = individualItem.value;
        }
      }
      return item;
    });
    setItems(newItems);
  };

  const handleAddEvent = (item) => {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var item = {
      id,
      name: "",
      price: 1.0,
      description: "",
      quantity: 1,
    };
    setItems((items) => [...items, item]);
  };

  const handleRowDel = (item) => {
    if (items.length > 1) {
      setItems((items) => items.filter((currentItem) => currentItem.id !== item.id));
    } else {
      setItems([
        {
          id: "0",
          name: "",
          price: 1.0,
          description: "",
          quantity: 1,
        },
      ]);
    }
  };

  const onCurrencyChange = (e) => {
    setState((state) => ({ ...state, currency: e.target.value }));
  };

  const handleCalculateTotal = () => {
    let subTotal = items.reduce(
      (total, item) => total + parseFloat(item.price) * parseInt(item.quantity),
      0
    );
    subTotal = parseFloat(subTotal).toFixed(2);

    const discountAmount = parseFloat(
      (subTotal * state.discountRate) / 100
    ).toFixed(2);

    const GSTAmount = parseFloat((subTotal * state.GSTRate) / 100).toFixed(2);

    const total = parseFloat(subTotal) + parseFloat(GSTAmount) - parseFloat(discountAmount);

    setTotal(total.toFixed(2));

    setState((state) => ({
      ...state,
      subTotal,
      GSTAmount,
      discountAmount,
    }));
  };

  useEffect(() => {
    handleCalculateTotal(items);
  }, [items, state.GSTRate, state.discountRate]);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setState((state) => ({ ...state, isOpen: true }));
      }}
    >
      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row justify-content-between">
              <div className="d-flex flex-row mb-3">
                <div className="mb-2">
                  <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                  <span className="current-date">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="d-flex flex-row mb-3">
                <div className="mb-2">
                  <span className="fw-bold">Billing&nbsp;Number:&nbsp;</span>
                  <span className="current-date">{state.billingNumber}</span>
                </div>
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Customer Details:</Form.Label>
                <Form.Control
                  placeholder="Enter Name"
                  value={state.billTo}
                  type="text"
                  name="billTo"
                  className="my-2"
                  onChange={onChange}
                  autoComplete="name"
                  required={true}
                />

                <Form.Control
                  placeholder="Enter Email"
                  value={state.billToEmail}
                  type="Email"
                  name="billToEmail"
                  className="my-2"
                  onChange={onChange}
                  autoComplete="email"
                />

                <Form.Control
                  placeholder="Enter Address"
                  value={state.billToAddress}
                  type="text"
                  name="billToAddress"
                  className="my-2"
                  onChange={onChange}
                  autoComplete="address"
                />
              </Col>

              <Col>
                <Form.Label className="fw-bold">Bill From:</Form.Label>
                <Form.Control
                  value={state.billFrom}
                  className="my-2"
                  disabled={true}
                />
                <Form.Control
                  value={state.billFromEmail}
                  className="my-2"
                  disabled={true}
                />
                <Form.Control
                  value={state.billFromAddress}
                  className="my-2"
                  disabled={true}
                />
              </Col>
            </Row>
            <InvoiceItem
              items={items}
              onItemizedItemEdit={onItemizedItemEdit}
              onRowAdd={handleAddEvent}
              onRowDel={handleRowDel}
              currency={state.currency}
            />

            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>
                    {state.currency} {state.subTotal}
                  </span>
                </div>

                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    {state.discountRate}% {state.currency}
                    {state.discountAmount}
                  </span>
                </div>

                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">GST Rate:</span>
                  <span>
                    {state.GSTRate}% {state.currency}
                    {state.GSTAmount}
                  </span>
                </div>

                <div className="d-flex flex-row align-items-start justify-content-between mt-2" style={{fontSize:'1.25rem'}}>
                  <span className="fw-bold">Total:</span>
                  <span>
                    {state.GSTRate}% {state.currency}
                    {total}
                  </span>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button
              variant="primary"
              type="submit"
              className="d-block w-100 mb-3"
            >
              Review Bill
            </Button>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                onChange={(e) => onCurrencyChange({ currency: e.target.value })}
                className="btn btn-light my-1"
              >
                <option value="₹">IND</option>
                <option value="$">USD</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="my-3">
              <Form.Label className="fw-bold">GST Rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="GSTRate"
                  type="number"
                  value={state.GSTRate}
                  onChange={onChange}
                  className="bg-white-border"
                  placeholder="0.00"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount Rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="discountRate"
                  type="number"
                  value={state.discountRate}
                  onChange={onChange}
                  className="bg-white-border"
                  placeholder="0.00"
                  min="0.00"
                  step="1"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
        </Col>
      </Row>
      <BillingModal
        showModal={state.isOpen}
        closeModal={() => setState((state) => ({ ...state, isOpen: false }))}
        info={state}
        items={items}
        total={total}
      />
    </Form>
  );
}

export default BillingForm;


// import React, { useState, useEffect } from "react";
// import { Card, Col, Form, Row, Button, InputGroup } from "react-bootstrap";
// import axios from "axios"; // Using axios for API call
// import InvoiceItem from "./reusable/billingitem";
// import BillingModal from "./reusable/billmodal";

// function BillingForm() {
//   const [state, setState] = useState({
//     isOpen: false,
//     currency: "₹",
//     currentDate: new Date().toLocaleDateString(),
//     billingNumber: 1,
//     billTo: "",
//     billToAddress: "",
//     billToEmail: "",
//     billFrom: "KS Groups",
//     billFromEmail: "Ksgrp@gmail.com",
//     billFromAddress: "Chennai, TamilNadu",
//     notes: "",
//     subTotal: "0.00",
//     GSTRate: 0,
//     GSTAmount: "0.00",
//     discountRate: 0,
//     discountAmount: "0.00",
//   });

//   const [total, setTotal] = useState(0.0);
//   const [items, setItems] = useState([
//     {
//       id: "0",
//       name: "",
//       description: "",
//       price: 1.0,
//       quantity: 1,
//     },
//   ]);

//   // Handle changes in form inputs
//   const onChange = (event) => {
//     setState((state) => ({
//       ...state,
//       [event.target.name]: event.target.value,
//     }));
//   };

//   // Handle form submission
//   const onSubmit = (e) => {
//     e.preventDefault();

//     // Prepare billing details for API call
//     const billingDetails = {
//       billTo: state.billTo,
//       billToEmail: state.billToEmail,
//       billToAddress: state.billToAddress,
//       total: total,
//       items: items,
//       currency: state.currency,
//       GSTAmount: state.GSTAmount,
//       discountAmount: state.discountAmount,
//       billingNumber: state.billingNumber,
//     };

//     // Make API call to save billing details
//     axios
//       .post("http://localhost:5000/save-billing", billingDetails)
//       .then((response) => {
//         console.log(response.data);
//         alert("Billing details saved successfully!");
//       })
//       .catch((error) => {
//         console.error("There was an error saving the billing details!", error);
//       });

//     // Open modal for review
//     setState((state) => ({ ...state, isOpen: true }));
//   };

//   // Calculate subtotal, GST, discount, and total
//   const handleCalculateTotal = () => {
//     let subTotal = items.reduce(
//       (total, item) => total + parseFloat(item.price) * parseInt(item.quantity),
//       0
//     );
//     subTotal = parseFloat(subTotal).toFixed(2);

//     const discountAmount = parseFloat(
//       (subTotal * state.discountRate) / 100
//     ).toFixed(2);

//     const GSTAmount = parseFloat((subTotal * state.GSTRate) / 100).toFixed(2);

//     const totalAmount = parseFloat(subTotal) + parseFloat(GSTAmount) - parseFloat(discountAmount);

//     setTotal(totalAmount.toFixed(2));

//     setState((state) => ({
//       ...state,
//       subTotal,
//       GSTAmount,
//       discountAmount,
//     }));
//   };

//   // Add new item
//   const handleAddEvent = () => {
//     var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
//     var newItem = {
//       id,
//       name: "",
//       price: 1.0,
//       description: "",
//       quantity: 1,
//     };
//     setItems((items) => [...items, newItem]);
//   };

//   // Other functions (onItemizedItemEdit, handleRowDel, etc.) stay the same

//   // Recalculate total whenever items, GST rate, or discount rate change
//   useEffect(() => {
//     handleCalculateTotal();
//   }, [items, state.GSTRate, state.discountRate]);

//   return (
//     <Form onSubmit={onSubmit}>
//       {/* Your Billing Form UI goes here */}
//       <BillingModal
//         showModal={state.isOpen}
//         closeModal={() => setState((state) => ({ ...state, isOpen: false }))}
//         info={state}
//         items={items}
//         total={total}
//       />
//     </Form>
//   );
// }

// export default BillingForm;

