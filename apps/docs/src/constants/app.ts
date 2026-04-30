import { getBaseUrl, getBeApiUrl } from "@rzl-zone/utils-js/next";

import { env } from "@/utils/env";

type AppConfig = {
  /**
   * * ***The URL settings for the application.***
   */
  URL: {
    /**
     * * ***Base URL of the app.***
     */
    BASE_URL_APP: string;
    /**
     * * ***Base URL of the backend API.***
     */
    BASE_API_URL: string;

    /**
     * * ***Base URL of the app (DEV MODE).***
     */
    BASE_URL_APP_LOCAL: string;
    /**
     * * ***Base URL of the backend API (DEV MODE).***
     */
    BASE_API_URL_LOCAL: string;

    /**
     * * ***Value from env `NEXT_PUBLIC_GITHUB_REPO_URL`.***
     */
    GITHUB_REPO_URL: string;
    /**
     * * ***Value from env `NEXT_PUBLIC_GITHUB_ORG_URL`.***
     */
    GITHUB_ORG_URL: string;
  };
  /**
   * * ***The name of the application.***
   */
  APP_NAME: string;
  /**
   * * ***The release year of the application.***
   */
  APP_RELEASE: number;
  /**
   * * ***Information about the entity powering the application.***
   */
  APP_POWERED_BY: string;
  /**
   * * ***Link to the entity powering the app.***
   */
  APP_POWERED_BY_LINK: string;
  /**
   * * ***Server action headers for cookies and API calls.***
   */
  SERVER_ACTION: {
    /**
     * * ***Cookie header to indicate server action.***
     */
    COOKIES: string;
    /**
     * * ***General header for server action.***
     */
    HEADER: string;
  };
  /**
   * * ***Cookies Configs.***
   */
  COOKIES: {
    /**
     * * ***Cookies For SideBar State.***
     */
    SIDEBAR_DASHBOARD_STATE: string;
  };
};

/** ---------------------------------------------
 * * ***Configuration object containing essential app variables and constants.***
 * ---------------------------------------------
 *
 * @description This includes base URLs, app metadata, and server action-related values.
 */
export const APP_CONFIG: AppConfig = {
  /** The URL settings for the application. */
  URL: {
    // Base URL of the app
    BASE_URL_APP: getBaseUrl(),
    // Base URL of the backend API
    BASE_API_URL: getBeApiUrl(),

    // Base URL of the app
    BASE_URL_APP_LOCAL: env.NEXT_PUBLIC_BASE_URL_LOCAL,
    // Base URL of the backend API
    BASE_API_URL_LOCAL: env.NEXT_PUBLIC_BACKEND_API_URL_LOCAL,
    GITHUB_ORG_URL: env.NEXT_PUBLIC_GITHUB_ORG_URL,
    GITHUB_REPO_URL: env.NEXT_PUBLIC_GITHUB_REPO_URL
  },

  /**
   * The name of the application.
   */
  APP_NAME: env.NEXT_PUBLIC_APP_NAME,

  /**
   * The release year of the application.
   */
  APP_RELEASE: env.NEXT_PUBLIC_APP_RELEASE,

  /**
   * Information about the entity powering the application.
   */
  APP_POWERED_BY: env.NEXT_PUBLIC_APP_POWERED_BY,

  /**
   * Link to the entity powering the app.
   */
  APP_POWERED_BY_LINK: env.NEXT_PUBLIC_GITHUB_REPO_URL,

  /**
   * Server action headers for cookies and API calls.
   */
  SERVER_ACTION: {
    COOKIES: "x-server-action-invoked", // Cookie header to indicate server action
    HEADER: "x-server-action-invoked" // General header for server action
  },
  COOKIES: {
    SIDEBAR_DASHBOARD_STATE: "__rzl-sidebar_state-open"
  }
};
