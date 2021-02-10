import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
	const [values, setValues] = useState(initialState);

	const onChange = (event) => {
		// Reset error.
		// if (Object.keys(errors).length > 0) {
		// 	console.log("Onchange Errors", errors);
		// 	const newErrors =
		// 	delete errors[event.target.name]
		// 	setErrors({
		// 		...errors,
		// 		Object. [event.target.name]
		// 	});
		// }

		// Set values.
		setValues({
			...values,
			[event.target.name]: event.target.value,
		});
	};

	const onSubmit = (event) => {
		event.preventDefault();
		// Error handling on server-side.
		callback();
	};

	return {
		onChange,
		onSubmit,
		values,
	};
};
