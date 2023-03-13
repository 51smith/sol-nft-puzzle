import React from "react";
import useSWR from "swr";
import clientApi from "../utils/http-common";

export default function useBackgrounds() {
    const fetcher = (url) => clientApi.get(url).then((res) => JSON.parse(res.data));
    const {data, error} = useSWR("get_backgrounds", fetcher);


    return {
        backgrounds: data,
        isLoading: !error && !data,
        isError: error,
    };
}