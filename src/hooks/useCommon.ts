import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchPermissions, fetchRoles, fetchSpecialties } from "../services/common";
import { useEffect } from "react";
import { setError, setPermissions, setSpecialties } from "../store/commonSlice";

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

export const useRoles = () => {
  const dispatch = useDispatch();

  const queryResult = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
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

export const usePermissions = () => {
  const dispatch = useDispatch();

  const queryResult = useQuery({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
  });

  useEffect(() => {
    if (queryResult.data) {
      dispatch(setPermissions(queryResult.data));
    }
    
    if (queryResult.error) {
      dispatch(setError(queryResult.error.message));
    }
  }, [queryResult.data, queryResult.error, dispatch]);

  return queryResult;
};