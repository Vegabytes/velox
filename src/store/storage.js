export const getCurrentUser = () => JSON.parse(localStorage.getItem("currentUser"));
export const setCurrentUser = currentUser =>
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
