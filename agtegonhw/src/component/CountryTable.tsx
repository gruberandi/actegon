import React, { useState } from "react";
import { Pagination } from 'rsuite';
import "./CountryTableSyle.css"

interface Country {
    code: string;
    name: string;
    capital: string;
    currency: string;
}

interface Props {
    countries: Country[];
}

const CountryTable: React.FC<Props> = ({ countries }) => {
    const [activePage, setActivePage] = useState<any>(1);
    const countriesPerPage: number = 20;
    const indexOfLastCountry: number = activePage * countriesPerPage;
    const indexOfFirstCountry: number = indexOfLastCountry - countriesPerPage;
    const currentCountries: Country[] = countries.slice(indexOfFirstCountry, indexOfLastCountry);

    const handlePageChange = (page: any) => {
        setActivePage(typeof page === 'string' ? parseInt(page) : page as number);
    };

    return (
        <div>
            <table className="table" id="table">
                <thead className="head" id="head">
                    <tr>
                        <th>Code</th>
                        <th>Country</th>
                        <th>Capital</th>
                        <th>Currency</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCountries.map((country, index) => (
                        <tr key={index}>
                            <td>{country.code}</td>
                            <td>{country.name}</td>
                            <td>{country.capital}</td>
                            <td>{country.currency}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div id="pagination">
                <Pagination
                    prev
                    next
                    first
                    last
                    size="md"
                    pages={Math.ceil(countries.length / countriesPerPage)}
                    activePage={activePage}
                    onSelect={(page: any) => handlePageChange(page)} total={0}                />
            </div>
        </div>
    );
};

export default CountryTable;
