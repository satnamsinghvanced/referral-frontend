import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchSpecialties } from "../services/common";
import { useEffect } from "react";
import { setError, setSpecialties } from "../store/commonSlice";

export const useSpecialties = () => {
  const dispatch = useDispatch();

  const queryResult = useQuery({
    queryKey: ["specialties"],
    queryFn: fetchSpecialties,
  });

  useEffect(() => {
    if (queryResult.data) {
      dispatch(setSpecialties(queryResult.data));
    }
    
    if (queryResult.error) {
      dispatch(setError(queryResult.error.message));
    }
  }, [queryResult.data, queryResult.error, dispatch]);

  return queryResult;
};