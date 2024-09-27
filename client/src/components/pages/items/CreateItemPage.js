import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ItemSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Item name must be at least 3 characters long")
    .required("Item name is required"),
  group: Yup.string().required("Group is required"),
  form: Yup.string().required("Form is required"),
  department: Yup.string().required("Department is required"),
});

const CreateItemPage = () => {
  return (
    <div>
      <h2>Create a New Item</h2>
      <Formik
        initialValues={{
          name: '',
          description: '',
          group: '',
          form: '',
          department: '',
          size: '',
          price_per_unit: '',
          total_price: '',
        }}
        validationSchema={ItemSchema}
        onSubmit={(values) => {
          axios.post('/api/items', values)
            .then(response => {
              console.log("Item created:", response.data);
            })
            .catch(error => {
              console.error("There was an error creating the item!", error);
            });
        }}
      >
        {({ values }) => (
          <Form>
            <div>
              <label htmlFor="name">Item Name</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <label htmlFor="group">Group</label>
              <Field as="select" name="group">
                <option value="">Select a group</option>
                <option value="Dairy">Dairy</option>
                <option value="Fruits/Vege.">Fruits/Vege.</option>
                <option value="Grains">Grains</option>
                <option value="Proteins">Proteins</option>
                <option value="Others">Others</option>
              </Field>
              <ErrorMessage name="group" component="div" />
            </div>
            <div>
              <label htmlFor="form">Form</label>
              <Field as="select" name="form">
                <option value="">Select a form</option>
                <option value="bottle">Bottle</option>
                <option value="tub">Tub</option>
                <option value="sliced">Sliced</option>
                <option value="block">Block</option>
                <option value="carton">Carton</option>
                <option value="fresh">Fresh</option>
                <option value="frozen">Frozen</option>
                <option value="package">Package</option>
                <option value="bag">Bag</option>
                <option value="loaf">Loaf</option>
              </Field>
              <ErrorMessage name="form" component="div" />
            </div>
            <div>
              <label htmlFor="department">Department</label>
              <Field as="select" name="department">
                <option value="">Select a department</option>
                <option value="beverages">Beverages</option>
                <option value="dairy">Dairy</option>
                <option value="produce">Produce</option>
                <option value="baked goods">Baked Goods</option>
                <option value="snacks">Snacks</option>
                <option value="dry goods">Dry Goods</option>
                <option value="canned goods">Canned Goods</option>
                <option value="frozen goods">Frozen Goods</option>
                <option value="pantry">Pantry</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="meat">Meat</option>
              </Field>
              <ErrorMessage name="department" component="div" />
            </div>
            <div>
              <label htmlFor="size">Size</label>
              <Field name="size" type="text" />
            </div>
            <div>
              <label htmlFor="price_per_unit">Price per Unit</label>
              <Field name="price_per_unit" type="number" step="0.01" />
            </div>
            <div>
              <label htmlFor="total_price">Total Price</label>
              <Field name="total_price" type="number" step="0.01" />
            </div>
            <button type="submit">Create Item</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateItemPage;
