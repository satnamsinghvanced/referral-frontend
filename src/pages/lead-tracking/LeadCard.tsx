import React from "react";
import { Card, CardBody, Chip } from "@heroui/react";
import { LuMapPin } from "react-icons/lu";
import { HiStar } from "react-icons/hi";

interface LeadCardProps {
    lead: {
        id: number;
        name: string;
        email: string;
        phone: string;
        source: string;
        status: string;
        treatments: string[];
        value: string;
        score: number;
        responseTime: string;
        priority: string;
        stage: string;
    };
    getPriorityColor: (priority: string) => string;
}

const LeadCard = ({ lead, getPriorityColor }: LeadCardProps) => {
    return (
        <Card
            key={lead.id}
            shadow="none"
            className="group border border-foreground/10 bg-white dark:bg-background transition-all cursor-pointer hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-lg dark:hover:shadow-primary/10 hover:-translate-y-0.5"
        >
            <CardBody className="p-3 space-y-2.5">
                <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-[11px] transition-colors group-hover:text-primary truncate">
                            {lead.name}
                        </h5>
                        <p className="text-[10px] text-gray-400 truncate">
                            {lead.email}
                        </p>
                    </div>
                    <Chip
                        size="sm"
                        variant="flat"
                        color={getPriorityColor(lead.priority) as any}
                        className="text-[9px] h-4.5 px-1 font-bold min-w-max ml-2"
                    >
                        {lead.priority}
                    </Chip>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                        <LuMapPin className="size-3 opacity-60" />
                        <span className="truncate">{lead.source}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {lead.treatments.map((treatment, idx) => (
                            <Chip
                                key={idx}
                                size="sm"
                                variant="flat"
                                className="text-[9px] h-4.5 bg-sky-50 text-sky-600 px-1.5 font-bold"
                            >
                                {treatment}
                            </Chip>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <span className="font-bold text-[10px]">{lead.value}</span>
                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-gray-500">
                        <HiStar className="text-yellow-400 size-3" />
                        <span>{lead.score}</span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default LeadCard;
