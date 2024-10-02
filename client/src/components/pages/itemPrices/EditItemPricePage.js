import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams } from "react-router-dom";

const ItemPriceSchema = Yup.object().shape({
  price: Yup.number()
    .min(0, "Price must be a positive number")
    .required("Price is required"),
  store_id: Yup.number().required("Store is required"),
  item_id: Yup.number().required("Item is required"),
});

const EditItemPricePage = () => {
  const { id } = useParams();
  const [itemPrice, setItemPrice] = React.useState(null);

  useEffect(() => {
    axios
      .get(`/api/item-prices/${id}`)
      .then((response) => setItemPrice(response.data))
      .catch((error) => console.error("Error fetching item price:", error));
  }, [id]);

  const handleSubmit = (values) => {
    axios
      .put(`/api/item-prices/${id}`, values)
      .then((response) => {
        console.log("Item price updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating item price:", error);
      });
  };

  if (!itemPrice) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Item Price</h2>
      <Formik
        initialValues={{
          price: itemPrice.price,
          store_id: itemPrice.store_id,
          item_id: itemPrice.item_id,
        }}
        validationSchema={ItemPriceSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form>
            <div>
              <label htmlFor="price">Price</label>
              <Field name="price" type="number" />
              <ErrorMessage name="price" component="div" />
            </div>
            <div>
              <label htmlFor="store_id">Store ID</label>
              <Field name="store_id" type="number" />
              <ErrorMessage name="store_id" component="div" />
            </div>
            <div>
              <label htmlFor="item_id">Item ID</label>
              <Field name="item_id" type="number" />
              <ErrorMessage name="item_id" component="div" />
            </div>
            <button type="submit">Update Item Price</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditItemPricePage;
