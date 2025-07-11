import { useEffect, useState } from "react";
function useLocalStorage(key, initialValue) {



    const [storedValue, setStoredValue] = useState(() => {
        try {
            //get value from local storage using key
            const item = window.localStorage.getItem(key);

            return item ? JSON.parse(item) : initialValue;
        }
        catch (error) {
            console.log(error);
            return initialValue;
        }
    })
    useEffect(() => {
        try {
            const valueToStore = typeof storedValue === "function" ? storedValue(storedValue) : storedValue;

            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);

        }

    }, [key, storedValue])

    return [storedValue, setStoredValue]
};

export default useLocalStorage;