import { Bounce } from "react-toastify"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (type,message) => {

    let options = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    }
    // toast('🦄 Wow so easy!', {});

    switch (type) {
        case 'info':
            toast.info(message, options);
            break;
        case 'success':
            toast.success(message, options);
            break;
        case 'warning':
            toast.warning(message, options);
            break;
        case 'error':
            toast.error(message, options);
            break;
        default:
            toast(message, options);
            break;
    }
}