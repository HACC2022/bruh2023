import {logEvent} from "firebase/analytics";
import {analytics} from "../App";

export default function Analytics() {
    function user_login() {
        logEvent(analytics, "user_login");
    }

    function user_logout() {
        logEvent(analytics, "user_login");
    }

    function created_url(short_url: string) {
        logEvent(analytics, "created_url", {
            short_url
        });
    }

    function updated_url(short_url: string) {
        logEvent(analytics, "updated_url", {
            short_url
        });
    }

    function deleted_url(short_url: string) {
        logEvent(analytics, "deleted_url", {
            short_url
        });
    }

    function redirect(short_url: string) {
        logEvent(analytics, "redirect", {
            short_url
        });
    }

    function redirect_cancelled(short_url: string | undefined) {
        logEvent(analytics, "redirect_cancelled", {
            short_url
        });
    }

    return {user_login, user_logout, created_url, updated_url, deleted_url, redirect, redirect_cancelled};
}