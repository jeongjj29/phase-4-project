import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ItemSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Item name must be at least 3 characters long")
    .required("Item name is required"),
});

const CreateItemPage = () => {
  return (
    <div>
      <h2>Create a New Item</h2>
      <Formik
        initialValues={{ name: "" }}
        validationSchema={ItemSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          axios
            .post("http://localhost:3001/api/items/create", values)
            .then((response) => {
              console.log("Item created:", response.data);
              resetForm();
            })
            .catch((error) => {
              console.error("Error creating item:", error);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="name">Item Name</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Create Item
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateItemPage;
