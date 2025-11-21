// AdvancedPatientSearchTable.jsx — FINAL VERSION (2025 EHR Grade)
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { usePatientSearch } from "@/features/patient/hooks/usePatientSearch";
import InfiniteScroll from "react-infinite-scroll-component";

export default function AdvancedPatientSearchTable() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [idTypeNo, setIdTypeNo] = useState("");  // MRN / DNI / Passport

  const [debLast] = useDebounce(lastName.trim(), 400);
  const [debFirst] = useDebounce(firstName.trim(), 400);
  const [debId] = useDebounce(idTypeNo.trim(), 400);

  const { patients, hasMore, searchPatients, loadMorePatients, setPatients } =
    usePatientSearch();

  // SMART SEARCH TERM BUILDER — Optimized for your resolver
  const getOptimalSearchTerm = () => {
    // Priority order (most specific first)
    if (debId) return debId;                    // ID number → exact match, fastest
    if (debLast && debFirst) return `${debLast} ${debFirst}`;  // Full name
    if (debLast) return debLast;                // Last name only
    if (debFirst) return debFirst;              // First name only
    return "";
  };

  // Trigger search on any field change
  useEffect(() => {
    const term = getOptimalSearchTerm();

    if (term.length < 2) {
      setPatients([]);
      return;
    }

    // This will hit your resolver perfectly!
    searchPatients(term.toUpperCase());
  }, [debLast, debFirst, debId, searchPatients, setPatients]);

  const handleClear = () => {
    setLastName("");
    setFirstName("");
    setIdTypeNo("");
    setPatients([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Búsqueda Avanzada de Pacientes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Apellido(s)
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ej: GARCÍA"
              className="w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition uppercase text-lg"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre(s)
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ej: JUAN CARLOS"
              className="w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition uppercase text-lg"
            />
          </div>

          {/* ID / MRN */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nº Documento / Historia
            </label>
            <input
              type="text"
              value={idTypeNo}
              onChange={(e) => setIdTypeNo(e.target.value)}
              placeholder="Ej: 12345678 o A123456"
              className="w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-green-200 focus:border-green-500 transition font-mono text-lg"
            />
          </div>
        </div>

        {/* Active Filter Chips */}
        {(debLast || debFirst || debId) && (
          <div className="mt-6 pt-4 border-t flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-600">Filtros activos:</span>
            {debLast && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Apellido: {debLast}</span>}
            {debFirst && <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Nombre: {debFirst}</span>}
            {debId && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Doc: {debId}</span>}
            <button onClick={handleClear} className="text-sm text-red-600 hover:text-red-800 font-medium ml-4">
              ✕ Limpiar todo
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <InfiniteScroll
        dataLength={patients.length}
        next={loadMorePatients}
        hasMore={hasMore}
        loader={<div className="text-center py-6 text-gray-600">Cargando más...</div>}
      >
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Nº Documento</th>
                <th className="px-6 py-4 text-left font-bold">Nombre Completo</th>
                <th className="px-6 py-4 text-left font-bold">Apellidos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-20 text-gray-500 text-lg">
                    {debLast || debFirst || debId
                      ? "No se encontraron pacientes con esos criterios"
                      : "Escriba en cualquier campo para comenzar"}
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-blue-50 cursor-pointer transition"
                    onClick={() => (window.location.href = `/patient/${p.id}`)}
                  >
                    <td className="px-6 py-4 font-mono font-bold text-blue-700">
                      {p.idTypeNo}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {p.fullName}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {p.lastName} {p.lastName2 || ""}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </InfiniteScroll>
    </div>
  );
}