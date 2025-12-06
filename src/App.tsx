import React, { useState } from "react";
import "./App.css";

type Person = {
    name: string;
    gift: string;
    price: string;
};

type PersonCardProps = {
    person: Person;
    index: number;
    updatePerson: (index: number, field: keyof Person, value: string) => void;
    onRemove: () => void;
};

function PersonCard({ person, index, updatePerson, onRemove }: PersonCardProps) {
    const handleChange =
        (field: keyof Person) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                updatePerson(index, field, e.target.value);
            };

    return (
        <div className="person-card">
            <div className="card-header">
                <input
                    className="name-input"
                    placeholder="Name"
                    value={person.name}
                    onChange={handleChange("name")}
                />
                <button
                    onClick={onRemove}
                    className="delete-btn"
                    aria-label="Delete"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M12 4L4 12M4 4l8 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </div>
            <input
                className="gift-input"
                placeholder="Gift idea"
                value={person.gift}
                onChange={handleChange("gift")}
            />
            <div className="price-wrapper">
                <span className="currency">$</span>
                <input
                    className="price-input"
                    type="number"
                    placeholder="0.00"
                    value={person.price}
                    onChange={handleChange("price")}
                />
            </div>
        </div>
    );
}


function BudgetRing({ percent }: { percent: number }) {
    const clamped = Math.max(0, Math.min(percent, 100));

    const radius = 90;          // was ~40–60
    const stroke = 14;          // thicker stroke
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clamped / 100) * circumference;

    return (
        <div className="budget-ring">
            <svg width={220} height={220}>   {/* was ~96 or 140 */}
                <circle
                    className="ring-track"
                    cx={110}
                    cy={110}
                    r={radius}
                    strokeWidth={stroke}
                    fill="none"
                />
                <circle
                    className="ring-progress"
                    cx={110}
                    cy={110}
                    r={radius}
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="budget-ring-label">
                <span className="budget-ring-percent">{clamped.toFixed(0)}%</span>
                <span className="budget-ring-caption">Used</span>
            </div>
        </div>
    );
}

function Main() {
    const [budget, setBudget] = useState<number>(0);
    const [people, setPeople] = useState<Person[]>([
        { name: "", gift: "", price: "" },
    ]);

    function updatePerson(
        index: number,
        field: keyof Person,
        value: string
    ): void {
        const updated = [...people];
        updated[index] = { ...updated[index], [field]: value };
        setPeople(updated);
    }

    const total = people.reduce((sum, p) => sum + Number(p.price || 0), 0);
    const remaining = Math.max(budget - total, 0);
    const percentUsed = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;

    const addPerson = () => {
        setPeople([...people, { name: "", gift: "", price: "" }]);
    };

    const removePerson = (index: number) => {
        if (people.length > 1) {
            setPeople(people.filter((_, i) => i !== index));
        }
    };

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setBudget(Number.isNaN(value) ? 0 : value);
    };

    return (
        <div className="app">
            {/* Ring in top-right corner */}
            <div className="budget-ring-container">
                <BudgetRing percent={percentUsed} />
            </div>

            <div className="header">
                <h1 className="title">Christmas Gift Budget 🎄</h1>
                <p className="subtitle">Track your holiday spending</p>
            </div>

            <div className="budget-card">
                <div className="budget-label">Total Budget</div>
                <div className="budget-input-wrapper">
                    <span className="currency">$</span>
                    <input
                        className="budget-input"
                        type="number"
                        placeholder="0.00"
                        value={budget === 0 ? "" : budget}
                        onChange={handleBudgetChange}
                    />
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Spent</div>
                    <div className="stat-value">${total.toFixed(2)}</div>
                </div>
                <div
                    className={`stat-card ${
                        total > budget && budget > 0 ? "warning" : ""
                    }`}
                >
                    <div className="stat-label">Remaining</div>
                    <div className="stat-value">${remaining.toFixed(2)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Budget Used</div>
                    <div className="stat-value">{percentUsed.toFixed(0)}%</div>
                </div>
            </div>

            <div className="main-card">
                <div className="section-header">
                    <h2 className="section-title">Gift List</h2>
                    <button className="add-btn" onClick={addPerson}>
                        + Add Person
                    </button>
                </div>

                <div className="people-grid">
                    {people.map((person, index) => (
                        <PersonCard
                            key={index}
                            person={person}
                            index={index}
                            updatePerson={updatePerson}
                            onRemove={() => removePerson(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Main;
