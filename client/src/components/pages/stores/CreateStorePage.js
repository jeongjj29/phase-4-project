import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Validation schema
const StoreSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters long")
    .required("Store name is required"),
});

const CreateStoreForm = () => {
  return (
    <div>
      <h2>Create a New Store</h2>
      <Formik
        initialValues={{ name: "" }}
        validationSchema={StoreSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          axios
            .post("/api/stores", values)
            .then((response) => {
              console.log("Store created:", response.data);
              resetForm();
            })
            .catch((error) => {
              console.error("Error creating store:", error);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="name">Store Name</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Create Store
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateStoreForm;
