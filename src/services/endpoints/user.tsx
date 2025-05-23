import api from "../api";

export function createGuestUser(villageId: string) {
    return api.post("/users", { 
        is_guest: true,
        name: "",
        phone: "",
        age: 0,
        village_id: villageId
     });
}