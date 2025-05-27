import { EssentialInfo } from '@/types/itinerary';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle, Phone } from 'lucide-react';

interface EssentialInfoProps {
    essentialInfo: EssentialInfo;
}

const EssentialInfoComponent: React.FC<EssentialInfoProps> = ({ essentialInfo }) => {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {essentialInfo.documents.map((document, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <Badge variant="outline" className="mt-0.5 h-2 w-2 rounded-full p-1 bg-primary" />
                                <span className="text-muted-foreground">{document}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <CardTitle>Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {essentialInfo.emergency_contacts.map((contact, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <div className="font-medium">{contact.type}</div>
                                {contact.number ? (
                                    <Button variant="secondary" size="sm" className="h-8 gap-1" asChild>
                                        <a href={`tel:${contact.number}`}>
                                            <Phone className="h-3.5 w-3.5" />
                                            <span>{contact.number}</span>
                                        </a>
                                    </Button>
                                ) : (
                                    <span className="text-muted-foreground text-sm">Not provided</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default EssentialInfoComponent;