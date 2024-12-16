'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import "@/components/ui/wave-loader.css"
const patientData = {
    "birth_date": {
        "day": 23,
        "month": 11,
        "year": 1964
    },
    "gender": "male",
    "id": "default",
    "name": "patient13",
    "properties": {
        "allergies": ["Peanuts", "Dust", "Pollen"],
        "blood_type": { "blood_type": "O+" },
        "current_diseases": ["101"],
        "current_medicaments": ["1"],
        "insurance": { "insurance": "PremiumCare" },
        "medical_history": [
            {
                "disease_id": "101",
                "end_date": "2023-02",
                "start_date": "2022-05"
            },
            {
                "disease_id": "102",
                "end_date": "N/A",
                "start_date": "2023-03"
            }
        ],
        "vaccines": ["COVID-19", "Influenza", "Rabies"]
    }
};

// Mock data for suggestions based on input.
// In a real scenario, you might fetch suggestions from an API.
const medicationSuggestions = [
    "Acetaminophen",
    "Ibuprofen",
    "Amoxicillin",
    "Metformin",
    "Lisinopril"
];

export default function TreatmentManager() {
    const [medications, setMedications] = useState(patientData.properties.current_medicaments);
    const [diseases, setDiseases] = useState(patientData.properties.current_diseases);
    const [newMed, setNewMed] = useState("");
    const [newDisease, setNewDisease] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    // Mock vital signs
    const vitals = {
        pulse: 78,
        pressure: "120/80",
        oxygenation: 97 // percentage
    };

    const handleAddMedication = () => {
        if (newMed.trim() !== "") {
            setMedications([...medications, newMed.trim()]);
            setNewMed("");
            setFilteredSuggestions([]);
        }
    };

    const handleAddDisease = () => {
        if (newDisease.trim() !== "") {
            setDiseases([...diseases, newDisease.trim()]);
            setNewDisease("");
        }
    };

    // @ts-ignore
    const handleMedInputChange = (e) => {
        const val = e.target.value;
        setNewMed(val);
        if (val.length > 0) {
            const suggestions = medicationSuggestions.filter(m => m.toLowerCase().includes(val.toLowerCase()));
            // @ts-ignore
            setFilteredSuggestions(suggestions);
        } else {
            setFilteredSuggestions([]);
        }
    };

    // @ts-ignore
    const handleMedSuggestionClick = (suggestion) => {
        setNewMed(suggestion);
        setFilteredSuggestions([]);
    };

    return (
        <div className="p-8 bg-white text-black space-y-4 border border-black">
            <Card className="border border-black">
                <CardHeader>
                    <CardTitle className="font-bold uppercase">Patient Information</CardTitle>
                    <CardDescription>ID: {patientData.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Name:</strong> {patientData.name}</p>
                    <p><strong>Birth Date:</strong> {patientData.birth_date.day}/{patientData.birth_date.month}/{patientData.birth_date.year}</p>
                    <p><strong>Gender:</strong> {patientData.gender}</p>
                </CardContent>
            </Card>

            <Tabs defaultValue="medications" className="border border-black">
                <TabsList className="border-b border-black">
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                    <TabsTrigger value="diseases">Diseases</TabsTrigger>
                    <TabsTrigger value="history">Medical History</TabsTrigger>
                    <TabsTrigger value="allergies">Allergies</TabsTrigger>
                    <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
                    <TabsTrigger value="insurance">Insurance</TabsTrigger>
                    <TabsTrigger value="blood">Blood Type</TabsTrigger>
                    <TabsTrigger value="analysis">Vital Signs & Analysis</TabsTrigger>
                </TabsList>

                {/* Medications Tab */}
                <TabsContent value="medications" className="p-4">
                    <h2 className="font-bold text-lg border-b border-black mb-2">Current Medications</h2>
                    <ul className="list-disc ml-5 space-y-1">
                        {medications.map((med, idx) => (
                            <li key={idx}>{med}</li>
                        ))}
                    </ul>
                    <div className="flex gap-2 mt-4 items-end">
                        <div className="flex flex-col">
                            <Label htmlFor="newMed">Add Medication</Label>
                            <Input
                                id="newMed"
                                value={newMed}
                                onChange={handleMedInputChange}
                                placeholder="Type medication..."
                            />
                            {filteredSuggestions.length > 0 && (
                                <div className="border border-black mt-1 bg-white z-10 max-h-32 overflow-auto">
                                    {filteredSuggestions.map((s, i) => (
                                        <div
                                            key={i}
                                            onClick={() => handleMedSuggestionClick(s)}
                                            className="cursor-pointer hover:bg-gray-200 p-2"
                                        >
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button onClick={handleAddMedication} className="border border-black bg-white hover:bg-gray-100 text-black">Add</Button>
                    </div>
                </TabsContent>

                {/* Diseases Tab */}
                <TabsContent value="diseases" className="p-4">
                    <h2 className="font-bold text-lg border-b border-black mb-2">Current Diseases</h2>
                    <ul className="list-disc ml-5 space-y-1">
                        {diseases.map((d, idx) => (
                            <li key={idx}>{d}</li>
                        ))}
                    </ul>
                    <div className="flex gap-2 mt-4 items-end">
                        <div className="flex flex-col">
                            <Label htmlFor="newDisease">Add Disease</Label>
                            <Input
                                id="newDisease"
                                value={newDisease}
                                onChange={(e) => setNewDisease(e.target.value)}
                                placeholder="Type disease code or name..."
                            />
                        </div>
                        <Button onClick={handleAddDisease} className="border border-black bg-white hover:bg-gray-100 text-black">Add</Button>
                    </div>
                </TabsContent>

                {/* Medical History Tab */}
                <TabsContent value="history" className="p-4">
                    <h2 className="font-bold text-lg border-b border-black mb-2">Medical History</h2>
                    <ScrollArea className="max-h-48">
                        <Table className="w-full border border-black">
                            <TableHeader className="border-b border-black">
                                <TableRow>
                                    <TableHead>Disease ID</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {patientData.properties.medical_history.map((m, i) => (
                                    <TableRow key={i} className="border-b border-black">
                                        <TableCell>{m.disease_id}</TableCell>
                                        <TableCell>{m.start_date}</TableCell>
                                        <TableCell>{m.end_date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </TabsContent>

                {/* Allergies Tab */}
                <TabsContent value="allergies" className="p-4">
                    <h2 className="font-bold text-lg border-b border-black mb-2">Allergies</h2>
                    <ul className="list-disc ml-5 space-y-1">
                        {patientData.properties.allergies.map((a, i) => (
                            <li key={i}>{a}</li>
                        ))}
                    </ul>
                </TabsContent>

                {/* Vaccines Tab */}
                <TabsContent value="vaccines" className="p-4">
                    <h2 className="font-bold text-lg border-b border-black mb-2">Vaccines</h2>
                    <ul className="list-disc ml-5 space-y-1">
                        {patientData.properties.vaccines.map((v, i) => (
                            <li key={i}>{v}</li>
                        ))}
                    </ul>
                </TabsContent>

                {/* Insurance Tab */}
                <TabsContent value="insurance" className="p-4">
                    <h2 className="font-bold text-lg border-b border-black mb-2">Insurance</h2>
                    <p>{patientData.properties.insurance.insurance}</p>
                </TabsContent>

                {/* Blood Type Tab */}
                <TabsContent value="blood" className="p-4">
                    <h2 className="font-bold text-lg border-b border-black mb-2">Blood Type</h2>
                    <p>{patientData.properties.blood_type.blood_type}</p>
                </TabsContent>

                {/* Vital Signs & Analysis Tab */}
                <TabsContent value="analysis" className="p-4 space-y-4">
                    <h2 className="font-bold text-lg border-b border-black mb-2">Vital Signs & Analysis</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="border border-black flex flex-col items-center justify-center p-4">
                            <CardHeader>
                                <CardTitle>Pulse</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <motion.div
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="text-2xl font-bold"
                                >
                                    {vitals.pulse} bpm
                                </motion.div>
                            </CardContent>
                        </Card>

                        <Card className="border border-black flex flex-col items-center justify-center p-4">
                            <CardHeader>
                                <CardTitle>Blood Pressure</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {vitals.pressure}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Oxygenation with Animated Circle */}
                        <Card className="border border-black flex flex-col items-center justify-center p-4">
                            <CardHeader>
                                <CardTitle>Oxygenation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <span className="wave-loader text-center text-r">11</span>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
