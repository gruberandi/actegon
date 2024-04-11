import React, { useEffect, useState } from "react";
import CountryTable from "../component/CountryTable";
import "./Page.css";

interface Country {
    code: string;
    name: string;
    emojiU: string;
    capital: string;
    currency: string;
}

const FilterByCodeAndCurrency: React.FC = () => {
    const [continent, setContinent] = useState<Country[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [continentCode, setContinentCode] = useState<string>("");
    const [currency, setCurrency] = useState<string>("");
    const [searchType, setSearchType] = useState<string>("continentCurrency");

    useEffect(() => {
        const fetchData = async () => {
            const countriesData = await fetchCountries();
            const continentData = await fetchContinents();
            setCountries(countriesData);
            setContinent(continentData);
        };
        fetchData();
    }, []);

    const fetchCountries = async (): Promise<Country[]> => {
        try {
            const response = await fetch("https://countries.trevorblades.com/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
                        query {
                            countries {
                                code
                                name
                                emojiU
                                capital
                                currency
                            }
                        }
                    `,
                }),
            });
            const { data } = await response.json();
            return data.countries;
        } catch (error) {
            console.log("Error fetching countries:", error);
            return [];
        }
    };

    const fetchContinents = async (): Promise<Country[]> => {
        try {
            const response = await fetch("https://countries.trevorblades.com/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
                        query {
                            continents {
                                code
                                name
                            }
                        }
                    `,
                }),
            });
            const { data } = await response.json();
            return data.continents;
        } catch (error) {
            console.log("Error fetching continents:", error);
            return [];
        }
    };

    const fetchCountryByContinentandCurrency = async (code: string, currency: string): Promise<Country[]> => {
        try {
            const response = await fetch("https://countries.trevorblades.com/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
                        {
                            countries(filter: { continent: { eq: "${code}" }, currency: { ne: "${currency}" } }) {
                                code
                                name
                                emojiU
                                capital
                                currency
                            }
                        }
                    `,
                }),
            });
            const { data } = await response.json();
            return data.countries;
        } catch (error) {
            console.log("Error fetching countries:", error);
            return [];
        }
    };

    const fetchCountryByContinent = async (code: string): Promise<Country[]> => {
        try {
            const response = await fetch("https://countries.trevorblades.com/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
                        {
                            countries(filter: { continent: { eq: "${code}" } }) {
                                code
                                name
                                emojiU
                                capital
                                currency
                            }
                        }
                    `,
                }),
            });
            const { data } = await response.json();
            return data.countries;
        } catch (error) {
            console.log("Error fetching countries:", error);
            return [];
        }
    };

    const fetchCountryByCurrency = async (currency: string): Promise<Country[]> => {
        try {
            const response = await fetch("https://countries.trevorblades.com/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
                        {
                            countries(filter: { currency: { ne: "${currency}" } }) {
                                code
                                name
                                emojiU
                                capital
                                currency
                            }
                        }
                    `,
                }),
            });
            const { data } = await response.json();
            return data.countries;
        } catch (error) {
            console.log("Error fetching countries:", error);
            return [];
        }
    };

    const FilterByCodeCountry = async (code: string): Promise<Country[]> => {
        try {
            const response = await fetch("https://countries.trevorblades.com/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
                        query {
                            countries(filter: {
                                code: { eq: "${code}" }
                            }) {
                                code
                                name
                                emojiU
                                capital
                                currency
                            }
                        }
                    `,
                }),
            });
            const { data } = await response.json();
            return data.countries;
        } catch (error) {
            console.log("Error fetching countries:", error);
            return [];
        }
    };

    const handleSearch = async () => {
        let filteredData: Country[] = [];
        if (searchType === "continentCurrency" && continentCode) {
            filteredData = await fetchCountryByContinentandCurrency(continentCode, currency);
        } else if (!currency) {
            filteredData = await fetchCountryByContinent(continentCode);
        } else {
            filteredData = await fetchCountryByCurrency(currency);
        }
        setCountries(filteredData);
    };

    const handleSearchByCode = async (value: string) => {
        let filteredDatas: Country[] = [];
        if (!value) {
            filteredDatas = await fetchCountries();
        } else {
            filteredDatas = await FilterByCodeCountry(value);
        }
        setCountries(filteredDatas);
    };

    const handleRadioChange = (value: string) => {
        setSearchType(value);
    };

    return (
        <div>
            <div id="title">Country Finder</div>
            <div id="searchType">select Search type</div>
            <div>
                <input
                    type="radio"
                    value={"continentCurrency"}
                    onChange={() => handleRadioChange("continentCurrency")}
                    checked={searchType === "continentCurrency"}
                />
                <label>Select By Continent and currency</label>
            </div>
            <div>
                <input
                    type="radio"
                    value={"countryCode"}
                    onChange={() => handleRadioChange("countryCode")}
                    checked={searchType === "countryCode"}
                />
                <label> Select by Country code</label>
            </div>
            <div>
                <select
                    id="select"
                    onChange={(e) => {
                        setContinentCode(e.target.value);
                        handleSearch();
                    }}
                    disabled={searchType === "countryCode"}
                >
                    <option value="">Select continent</option>
                    {continent.map((cont) => (
                        <option key={cont.code} value={cont.code}>
                            {cont.name}
                        </option>
                    ))}
                </select>
                {searchType !== "countryCode" && (
                    <input
                        id="currencyInput"
                        type="text"
                        placeholder="currency"
                        value={currency}
                        onChange={(e) => {
                            setCurrency(e.target.value);
                            handleSearch();
                        }}
                    />
                )}
            </div>
            <div>
                <input
                    id="codeInput"
                    type="text"
                    placeholder="country Code"
                    onChange={(e) => handleSearchByCode(e.target.value)}
                    disabled={searchType === "continentCurrency"}
                />
            </div>
            <CountryTable countries={countries} />
        </div>
    );
};

export default FilterByCodeAndCurrency;
