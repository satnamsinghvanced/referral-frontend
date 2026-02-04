import { Button } from "@heroui/react";
import { BiHeart } from "react-icons/bi";
import { FaRegStar } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { LuHandshake } from "react-icons/lu";
import { MdOutlineWavingHand } from "react-icons/md";

import { LoadingState } from "../../../components/common/LoadingState";
import { useAutomationTemplates } from "../../../hooks/useCampaign";

const Templates = () => {
  const { data, isLoading } = useAutomationTemplates();
  const templates = data || [];

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-4 bg-background border border-foreground/10 rounded-xl p-4">
        <h4 className="font-medium text-sm">Pre-built Flow Templates</h4>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <LoadingState />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {templates.map((template) => {
              const { name, description, totalUses, _id } = template;

              return (
                <div
                  className="bg-content1 border border-foreground/10 rounded-xl p-4"
                  key={_id}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">{name}</h4>
                        <p className="text-xs text-gray-600 dark:text-foreground/60">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-foreground/10">
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-gray-500 dark:text-foreground/50">
                        {totalUses} uses
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        radius="sm"
                        variant="ghost"
                        onPress={() => {}}
                        className="border-small"
                        startContent={<FiEdit size={14} />}
                      >
                        Customize
                      </Button>
                      <Button
                        size="sm"
                        radius="sm"
                        variant="solid"
                        color="primary"
                        onPress={() => console.log(`Using template: ${name}`)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {templates.length === 0 && (
              <div className="col-span-2 text-center py-12 text-gray-500">
                No templates available.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
