"use client";

import React, { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "../../../lib/store";
import { INITIAL_ORDERS } from "../../../lib/data";
import { formatPKR, formatDate } from "../../../lib/utils";
import { Order } from "../../../types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadData = () => {
    setOrders(getOrders());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("la_verno_storage_changed", loadData);
    return () => window.removeEventListener("la_verno_storage_changed", loadData);
  }, []);

  const filtered = orders.filter((o) => {
    if (statusFilter === "all") return true;
    return o.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const handleUpdate = (id: string, newStatus: Order["status"]) => {
    updateOrderStatus(id, newStatus);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#201f1f]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#d1c5b4] uppercase tracking-wider">
            <span>Directoire Back-Office</span>
            <span>/</span>
            <span className="text-[#b89552] font-semibold">Orders & Dispatch</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#e5e2e1] mt-1">
            Order Management & Fulfillment
          </h1>
          <p className="text-xs text-[#d1c5b4]/80 mt-0.5">
            Track customer orders, inspect chosen colours and sizes, and update dispatch status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#e9c349]"></span>
          <span className="text-xs text-[#d1c5b4] font-mono">Local Order Sync Active</span>
        </div>
      </div>

      <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-4 rounded flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[#d1c5b4]">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#131313] border border-[#2a2a2a] text-[#e5e2e1] px-3 py-1.5 rounded cursor-pointer"
          >
            <option value="all">All Orders</option>
            <option value="in transit">In Transit</option>
            <option value="settled">Settled</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        <span className="text-[#e8c179] font-mono">{filtered.length} Orders Listed</span>
      </div>

      <div className="overflow-x-auto rounded border border-[#201f1f] bg-[#1c1b1b]">
        <table className="w-full text-left text-xs border-collapse min-w-[780px]">
          <thead>
            <tr className="bg-[#201f1f] text-[#d1c5b4] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Patron Name</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4 text-right">Total (PKR)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#201f1f] text-[#e5e2e1]">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-[#201f1f]/50 transition-colors">
                <td className="py-3 px-4 font-mono text-[#e8c179] font-medium">#{o.id}</td>
                <td className="py-3 px-4 font-medium">{o.shippingAddress.fullName}</td>
                <td className="py-3 px-4 text-[#d1c5b4] font-mono text-[11px]">{formatDate(o.date)}</td>
                <td className="py-3 px-4">{o.shippingAddress.city}</td>
                <td className="py-3 px-4 text-[#d1c5b4]">{o.paymentMethod}</td>
                <td className="py-3 px-4 text-right font-mono font-medium">
                  {formatPKR(o.total)}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono ${
                      o.status === "Settled" || o.status === "Delivered"
                        ? "bg-[#2a2a2a] text-[#e9c349]"
                        : o.status === "In Transit" || o.status === "Dispatched"
                        ? "bg-[#e8c179]/20 text-[#e8c179]"
                        : "bg-[#93000a]/20 text-[#ffb4ab]"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="px-2.5 py-1 rounded bg-[#201f1f] hover:bg-[#b89552] hover:text-[#432e00] text-[#d1c5b4] transition-colors font-medium text-[11px] cursor-pointer"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-[#201f1f]">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#b89552]">Order Dossier</p>
                <h3 className="text-lg font-semibold text-[#e5e2e1] font-mono">#{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#d1c5b4] hover:text-[#e5e2e1] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-[#131313] p-4 border border-[#201f1f] rounded space-y-1 text-xs">
              <p className="text-[10px] uppercase text-[#d1c5b4]">Customer & Shipping Address</p>
              <p className="font-medium text-[#e5e2e1]">{selectedOrder.shippingAddress.fullName}</p>
              <p className="text-[#d1c5b4]">
                {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
              </p>
              <p className="text-[#d1c5b4]">Phone: {selectedOrder.shippingAddress.phone}</p>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[10px] uppercase text-[#d1c5b4]">Ordered Pieces</p>
              <div className="divide-y divide-[#201f1f]">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center gap-3">
                    <div>
                      <span className="text-[#e5e2e1] block">
                        {item.name} (x{item.quantity})
                      </span>
                      {item.variants && Object.keys(item.variants).length > 0 && (
                        <span className="text-[11px] text-[#d1c5b4]/80">
                          {Object.entries(item.variants)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" · ")}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[#e8c179]">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#201f1f] flex justify-between font-semibold text-sm">
                <span>Total Settlement</span>
                <span className="font-mono text-[#e8c179]">{formatPKR(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#201f1f] text-xs">
              <label className="text-[10px] uppercase text-[#d1c5b4] block">Update Fulfillment Status</label>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleUpdate(selectedOrder.id, e.target.value as any)}
                className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
              >
                <option value="In Transit">In Transit</option>
                <option value="Settled">Settled</option>
                <option value="Verification Required">Verification Required</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#b89552] text-[#432e00] font-semibold text-xs rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
