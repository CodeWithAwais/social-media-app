

function useLocalStorage(key: string, defaultValue = {}){
    localStorage.setItem(key, JSON.stringify(defaultValue))
}

export default useLocalStorage;

