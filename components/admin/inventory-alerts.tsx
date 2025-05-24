"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, TrendingUp, TrendingDown, Box } from "lucide-react";
import Link from "next/link";
import { inventoryApi } from "@/lib/api/inventory";

export function InventoryAlerts() {
  const [animatedLowStock, setAnimatedLowStock] = useState(0);
  const [animatedOutOfStock, setAnimatedOutOfStock] = useState(0);
  const [animatedInStock, setAnimatedInStock] = useState(0);
  
  const { data:inve, isLoading } = useQuery({
    queryKey: ["inventoryOverview"],
    queryFn: inventoryApi.getInventoryOverview,
  });
  
  useEffect(() => {
    if (inve) {

      const duration = 1000;
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setAnimatedLowStock(Math.floor(inve.lowStockItems * progress));
        setAnimatedOutOfStock(Math.floor(inve.outOfStock * progress));
        setAnimatedInStock(Math.floor(inve.restockAlerts * progress));

        if (currentStep === steps) {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [inve]);

  
  const metrics = [
    {
      title: "Low Stock Items",
      value: animatedLowStock,
      icon: AlertTriangle,
      bgColor: "bg-[#fff5e6]",
      iconColor: "text-[#d97706]",
    },
    {
      title: "Out of Stock",
      value: animatedOutOfStock,
      icon: TrendingDown,
      bgColor: "bg-[#ffe6e6]",
      iconColor: "text-[#ff4d4d]",
    },
    {
      title: "In Stock",
      value: animatedInStock,
      icon: TrendingUp,
      bgColor: "bg-[#e6fdf1]",
      iconColor: "text-[#4fc48a]",
    },
  ];
  
  return (
    <div className="bg-white rounded-xl p-4 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-[#4f507f] border-b pb-3">
        Inventory Overview
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className={`p-3 md:p-4 ${metric.bgColor} rounded-xl shadow-sm`}>
              <metric.icon size={24} className={metric.iconColor} />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500">{metric.title}</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">{metric.value}</p>
            </div>
          </div>
        ))}
        
        <Link
          href="/admin/products/inventory"
          className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="p-3 md:p-4 bg-[#e6f3ff] rounded-xl shadow-sm">
            <Box size={24} className="text-[#3b82f6]" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500">View All</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">Inventory</p>
          </div>
        </Link>
      </div>
    </div>
  );
}