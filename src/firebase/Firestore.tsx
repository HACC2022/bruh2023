import {firestore} from "../App";
import {
    setDoc,
    doc,
    serverTimestamp,
    QuerySnapshot,
    deleteDoc,
    getDoc,
    updateDoc,
    getDocs, collection
} from "firebase/firestore";
import {LinkData} from "../types";
import Analytics from "./Analytics";

/**
 * Writes input to the database
 *
 * @param userid    user id
 * @param url       long url to store
 * @param surl      Short url, will generate a random one if blank
 * @param desc      Description of link
 * @param timer     Redirect timer toggle
 * @param reqAuth   toggle needing authentication for redirect
 */

export async function write(userid: string | undefined, url: string, surl: string, desc: string, timer: boolean, reqAuth: boolean) {
    if (!userid) return false;
    surl = surl === "" ? generateDistinct(5) : surl;

    // Check if link already exists
    let want = await getDoc(doc(firestore, 'links', surl))
    if (want.exists()) return false;

    try {
        // Must create user's links first before attempting to create /links
        await setDoc(doc(firestore, `users/${userid}/userLinks`, surl), {
            url: url,
            time: serverTimestamp(),
            description: desc,
            timer: timer,
            reqAuth: reqAuth
        });
        await setDoc(doc(firestore, 'links', surl), {
            url: url,
            timer: timer,
            reqAuth: reqAuth
        })

        Analytics().created_url(surl);
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
}

/**
 * Creates a random string with distinct lettering
 */
export function generateDistinct(length: number) {
    const distinct: string = "ABCDEFGHJKLMNPQRSTUVabcdefhjkmnorstuv23456789"
    let result = "";
    for (let i = 0; i < length; i++) {
        result += distinct.charAt(Math.floor(Math.random() * distinct.length));
    }
    return result;
}

/**
 * ##resolves redirection links
 * @param key
 * @return long url given a surl key
 * @return redirect timer state
 */
export async function resolveLink(key: string) {
    let link, timer,reqAuth;
    const data = await getDoc(doc(firestore, 'links', key))
    if (data.exists()) {
        link = data.data().url
        timer = data.data().timer
        reqAuth = data.data().reqAuth
    }
    return {link, timer,reqAuth};
}

export async function resolveSnapshotLinks(userid: string | undefined, snapshot?: QuerySnapshot): Promise<LinkData[]> {
    if (!userid) return [] as LinkData[];
    if (snapshot)
        return parseSnapshot(snapshot);
    else
        return parseSnapshot(await getDocs(collection(firestore, `/users/${userid}/userLinks`)));
}

function parseSnapshot(snapshot: QuerySnapshot) {
    let data: LinkData[] = [];
    snapshot.forEach((docs) => {
        data.push({short: docs.id, long: docs.data().url, desc: docs.data().description})
    });
    return data;
}

/**
 * deletes both documents containing the data related to the surl
 * @param userid
 * @param surl
 */
export async function removeData(userid: string | undefined, surl: string) {
    // Must delete links before userLinks due to security rules.
    try {
        await deleteDoc(doc(firestore, 'links', surl));
        await deleteDoc(doc(firestore, `/users/${userid}/userLinks`, surl));
        Analytics().deleted_url(surl);
    } catch (e) {
        console.error(e)
    }
}

export async function update(userid: string | undefined, url: string, surl: string, describe: string, timer: boolean, reqAuth: boolean) {
    try {
        await updateDoc(doc(firestore, `/users/${userid}/userLinks`, surl), {
            url: url,
            time: serverTimestamp(),
            description: describe,
            timer: timer,
            reqAuth: reqAuth
        });
        await updateDoc(doc(firestore, `/links`, surl), {
            url: url,
            timer: timer,
            reqAuth: reqAuth
        });
        Analytics().updated_url(surl);
    } catch (e) {
        console.error(e)
        return false;
    }
    return true;
}
