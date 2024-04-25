import { useSelector } from "react-redux";

export const useCategoriesActive = () => {
    const categories = useSelector(state => state.categories.data);
    return categories.filter(category => category.active === true);
}

export const useBrandsActive = () => {
    const brands = useSelector(state => state.brands.data);
    return brands.filter(brand => brand.active === true);
}