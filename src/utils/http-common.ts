import axios from "axios";

export default axios.create({
    baseURL: process.env.NEXT_PUBLIC_BG_SERVER,
    headers: {
        "Content-type": "application/json"
    }
});