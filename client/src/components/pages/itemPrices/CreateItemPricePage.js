import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ItemPriceSchema = Yup.object().shape({
  price: Yup.number().min(0, "Price must be a positive number").required("Price is required"),
  store_id: Yup.number().required("Store is required"),
  item_id: Yup.number().required("Item is required"),
});

const CreateItemPricePage = () => {
  const [stores, setStores] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/stores')
      .then((response) => setStores(response.data))
      .catch((error) => console.error('Error fetching stores:', error));

    axios.get('http://localhost:3001/api/items')
      .then((response) => setItems(response.data))
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  return (
    <div>
      <h1>Create Purchase</h1>
      <Formik
        initialValues={{ price: '', store_id: '', item_id: '' }}
        validationSchema={ItemPriceSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          axios.post('http://localhost:3001/api/item_prices/create', values)
            .then((response) => {
              console.log("Item price created:", response.data);
              resetForm();
            })
            .catch((error) => {
              console.error("Error creating item price:", error);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="price">Price</label>
              <Field name="price" type="number" step="0.01" />
              <ErrorMessage name="price" component="div" />
            </div>

            <div>
              <label htmlFor="store_id">Store</label>
              <Field as="select" name="store_id">
                <option value="" label="Select store" />
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="store_id" component="div" />
            </div>

            <div>
              <label htmlFor="item_id">Item</label>
              <Field as="select" name="item_id">
                <option value="" label="Select item" />
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="item_id" component="div" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Create Purchase
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateItemPricePage;
