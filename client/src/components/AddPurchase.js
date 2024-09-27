import React from "react";
import useFormik from "formik";
import * as yup from "yup";

function AddPurchase() {
  const datePriceFormSchema = yup.object().shape({
    date: yup.date().required(),
    price: yup.number().positive().float().required(),
    store_id: yup.number().positive().integer().required(),
  });

  const datePriceForm = useFormik({
    initialValues: {
      date: "",
      price: "",
      store_id: "",
    },
    validationSchema: datePriceFormSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const itemFormSchema = yup.object().shape({
    item_id: yup.number().positive().integer().required(),
    quantity: yup.number().positive().integer().required(),
  });

  const itemForm = useFormik({
    initialValues: {
      item_id: "",
      quantity: "",
    },
    validationSchema: itemFormSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return <div></div>;
}

export default AddPurchase;
