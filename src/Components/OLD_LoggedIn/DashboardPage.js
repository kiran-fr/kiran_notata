import React from "react";
import { Redirect } from "react-router-dom";
import { viewCompanies } from "../../routes";

export const DashboardPage = () => <Redirect to={viewCompanies} />