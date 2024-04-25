import { getState } from "../../redux/store";

const useToken = () => {
    const auth = getState().auth.data;
    const { accessToken, refreshToken } = auth;
    return [accessToken, refreshToken];
}

export default useToken;