import { useState } from "react";
import type { NavItem, FooterLink, CompanyInfo } from "~/data/nav";
import { ImageInput } from "~/components/ImageInput";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

function inputClass(extra = "") {
  return `w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500 ${extra}`.trim();
}

function buttonClass(variant: "primary" | "danger" | "secondary" = "primary") {
  const base =
    "px-3 py-1.5 rounded text-sm font-medium transition focus:outline-none";
  if (variant === "primary")
    return `${base} bg-green-600 hover:bg-green-500 text-white`;
  if (variant === "danger")
    return `${base} bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30`;
  return `${base} bg-gray-700 hover:bg-gray-600 text-gray-200`;
}

/* ------------------------------------------------------------------
   Itinerary editor
   ------------------------------------------------------------------ */
export function ItineraryEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: ItineraryDay[] | null | undefined;
}) {
  const [items, setItems] = useState<ItineraryDay[]>(() => {
    const arr = Array.isArray(defaultValue) ? defaultValue : [];
    return arr.map((item, index) => ({
      day: typeof item.day === "number" ? item.day : index + 1,
      title: String(item.title ?? ""),
      description: String(item.description ?? ""),
    }));
  });

  const serialized = JSON.stringify(
    items
      .filter((item) => item.title.trim() || item.description.trim())
      .map((item, index) => ({ ...item, day: index + 1 })),
  );

  const update = (index: number, field: keyof ItineraryDay, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const add = () =>
    setItems((prev) => [
      ...prev,
      { day: prev.length + 1, title: "", description: "" },
    ]);

  const remove = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serialized} />

      {items.map((item, index) => (
        <div
          key={index}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-green-400">
              Day {index + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(index)}
              className={buttonClass("danger")}
            >
              Remove
            </button>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => update(index, "title", e.target.value)}
              className={inputClass()}
              placeholder="e.g. Islamabad Arrival"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={item.description}
              onChange={(e) => update(index, "description", e.target.value)}
              rows={3}
              className={inputClass()}
              placeholder="What happens on this day?"
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={add} className={buttonClass("primary")}>
        + Add Day
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
   FAQ editor
   ------------------------------------------------------------------ */
export function FaqEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: FaqItem[] | null | undefined;
}) {
  const [items, setItems] = useState<FaqItem[]>(() => {
    const arr = Array.isArray(defaultValue) ? defaultValue : [];
    return arr.map((item) => ({
      question: String(item.question ?? ""),
      answer: String(item.answer ?? ""),
    }));
  });

  const serialized = JSON.stringify(
    items.filter((item) => item.question.trim() || item.answer.trim()),
  );

  const update = (index: number, field: keyof FaqItem, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const add = () => setItems((prev) => [...prev, { question: "", answer: "" }]);

  const remove = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serialized} />

      {items.map((item, index) => (
        <div
          key={index}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-green-400">
              FAQ #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(index)}
              className={buttonClass("danger")}
            >
              Remove
            </button>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Question</label>
            <input
              type="text"
              value={item.question}
              onChange={(e) => update(index, "question", e.target.value)}
              className={inputClass()}
              placeholder="e.g. What is the fitness level required?"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Answer</label>
            <textarea
              value={item.answer}
              onChange={(e) => update(index, "answer", e.target.value)}
              rows={3}
              className={inputClass()}
              placeholder="Write the answer here..."
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={add} className={buttonClass("primary")}>
        + Add FAQ
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
   Settings — Main Navigation editor
   ------------------------------------------------------------------ */
export function MainNavEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: NavItem[] | null | undefined;
}) {
  const [items, setItems] = useState<NavItem[]>(() => {
    const arr = Array.isArray(defaultValue) ? defaultValue : [];
    return arr.map((item) => ({
      label: String(item.label ?? ""),
      href: item.href ? String(item.href) : undefined,
      submenu: Array.isArray(item.submenu)
        ? item.submenu.map((sub) => ({
            label: String(sub.label ?? ""),
            href: sub.href ? String(sub.href) : undefined,
          }))
        : undefined,
    }));
  });

  const serialized = JSON.stringify(items.filter((item) => item.label.trim()));

  const updateItem = (index: number, patch: Partial<NavItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const addItem = () => setItems((prev) => [...prev, { label: "" }]);
  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const addSubmenu = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, submenu: [...(item.submenu ?? []), { label: "" }] }
          : item,
      ),
    );
  };

  const updateSubmenu = (
    itemIndex: number,
    subIndex: number,
    patch: Partial<NavItem>,
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === itemIndex
          ? {
              ...item,
              submenu: item.submenu?.map((sub, j) =>
                j === subIndex ? { ...sub, ...patch } : sub,
              ),
            }
          : item,
      ),
    );
  };

  const removeSubmenu = (itemIndex: number, subIndex: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === itemIndex
          ? {
              ...item,
              submenu: item.submenu?.filter((_, j) => j !== subIndex),
            }
          : item,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serialized} />

      {items.map((item, index) => (
        <div
          key={index}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-green-400">
              Nav Item #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className={buttonClass("danger")}
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Label</label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(index, { label: e.target.value })}
                className={inputClass()}
                placeholder="e.g. Trips"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Href</label>
              <input
                type="text"
                value={item.href ?? ""}
                onChange={(e) =>
                  updateItem(index, {
                    href: e.target.value ? e.target.value : undefined,
                  })
                }
                className={inputClass()}
                placeholder="e.g. /trips"
              />
            </div>
          </div>

          <div className="pl-4 border-l-2 border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">Submenu</span>
              <button
                type="button"
                onClick={() => addSubmenu(index)}
                className={buttonClass("secondary")}
              >
                + Add Submenu Link
              </button>
            </div>

            {item.submenu?.map((sub, subIndex) => (
              <div
                key={subIndex}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end"
              >
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={sub.label}
                    onChange={(e) =>
                      updateSubmenu(index, subIndex, { label: e.target.value })
                    }
                    className={inputClass()}
                    placeholder="e.g. All Trips"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">
                      Href
                    </label>
                    <input
                      type="text"
                      value={sub.href ?? ""}
                      onChange={(e) =>
                        updateSubmenu(index, subIndex, {
                          href: e.target.value ? e.target.value : undefined,
                        })
                      }
                      className={inputClass()}
                      placeholder="e.g. /trips"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubmenu(index, subIndex)}
                    className={buttonClass("danger")}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className={buttonClass("primary")}
      >
        + Add Nav Item
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
   Settings — Footer Links editor
   ------------------------------------------------------------------ */
export function FooterLinksEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: FooterLink[] | null | undefined;
}) {
  const [categories, setCategories] = useState<FooterLink[]>(() => {
    const arr = Array.isArray(defaultValue) ? defaultValue : [];
    return arr.map((cat) => ({
      category: String(cat.category ?? ""),
      links: Array.isArray(cat.links)
        ? cat.links.map((link) => ({
            label: String(link.label ?? ""),
            href: String(link.href ?? ""),
          }))
        : [],
    }));
  });

  const serialized = JSON.stringify(
    categories
      .map((cat) => ({
        ...cat,
        links: cat.links.filter(
          (link) => link.label.trim() || link.href.trim(),
        ),
      }))
      .filter((cat) => cat.category.trim() || cat.links.length > 0),
  );

  const updateCategory = (index: number, category: string) => {
    setCategories((prev) =>
      prev.map((cat, i) => (i === index ? { ...cat, category } : cat)),
    );
  };

  const addCategory = () =>
    setCategories((prev) => [...prev, { category: "", links: [] }]);
  const removeCategory = (index: number) =>
    setCategories((prev) => prev.filter((_, i) => i !== index));

  const addLink = (catIndex: number) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === catIndex
          ? { ...cat, links: [...cat.links, { label: "", href: "" }] }
          : cat,
      ),
    );
  };

  const updateLink = (
    catIndex: number,
    linkIndex: number,
    patch: Partial<{ label: string; href: string }>,
  ) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === catIndex
          ? {
              ...cat,
              links: cat.links.map((link, j) =>
                j === linkIndex ? { ...link, ...patch } : link,
              ),
            }
          : cat,
      ),
    );
  };

  const removeLink = (catIndex: number, linkIndex: number) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === catIndex
          ? { ...cat, links: cat.links.filter((_, j) => j !== linkIndex) }
          : cat,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serialized} />

      {categories.map((cat, catIndex) => (
        <div
          key={catIndex}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={cat.category}
              onChange={(e) => updateCategory(catIndex, e.target.value)}
              className={`${inputClass()} max-w-xs`}
              placeholder="Category name"
            />
            <button
              type="button"
              onClick={() => removeCategory(catIndex)}
              className={buttonClass("danger")}
            >
              Remove Category
            </button>
          </div>

          <div className="pl-4 border-l-2 border-gray-700 space-y-3">
            {cat.links.map((link, linkIndex) => (
              <div
                key={linkIndex}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end"
              >
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) =>
                      updateLink(catIndex, linkIndex, { label: e.target.value })
                    }
                    className={inputClass()}
                    placeholder="e.g. Home"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">
                      Href
                    </label>
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) =>
                        updateLink(catIndex, linkIndex, {
                          href: e.target.value,
                        })
                      }
                      className={inputClass()}
                      placeholder="e.g. /"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(catIndex, linkIndex)}
                    className={buttonClass("danger")}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addLink(catIndex)}
              className={buttonClass("secondary")}
            >
              + Add Link
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addCategory}
        className={buttonClass("primary")}
      >
        + Add Footer Category
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
   Settings — Company Info editor
   ------------------------------------------------------------------ */
const defaultCompanyInfo: CompanyInfo = {
  name: "",
  email: "",
  phone: "",
  location: "",
  description: "",
  whatsapp: "",
  logo: "",
  socialMedia: {
    facebook: "",
    instagram: "",
    youtube: "",
  },
};

export function CompanyInfoEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: CompanyInfo | null | undefined;
}) {
  const [info, setInfo] = useState<CompanyInfo>(() => {
    const src =
      defaultValue && typeof defaultValue === "object"
        ? defaultValue
        : defaultCompanyInfo;
    return {
      ...defaultCompanyInfo,
      ...src,
      socialMedia: {
        ...defaultCompanyInfo.socialMedia,
        ...(src.socialMedia && typeof src.socialMedia === "object"
          ? (src.socialMedia as Record<string, string>)
          : {}),
      },
    };
  });

  const update = (field: keyof CompanyInfo, value: string) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocial = (
    field: keyof CompanyInfo["socialMedia"],
    value: string,
  ) => {
    setInfo((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [field]: value },
    }));
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(info)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(
          [
            ["name", "Company Name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["location", "Location"],
            ["whatsapp", "WhatsApp Number"],
          ] as const
        ).map(([field, label]) => (
          <div key={field}>
            <label className="block text-xs text-gray-400 mb-1">{label}</label>
            <input
              type={field === "email" ? "email" : "text"}
              value={info[field]}
              onChange={(e) => update(field, e.target.value)}
              className={inputClass()}
            />
          </div>
        ))}
      </div>

      <div>
        <ImageInput
          name="logo"
          label="Logo"
          folder="company"
          value={info.logo}
          onChange={(value) => update("logo", value)}
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Description</label>
        <textarea
          value={info.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          className={inputClass()}
        />
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
        <span className="text-sm font-semibold text-green-400">
          Social Media
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(
            [
              ["facebook", "Facebook URL"],
              ["instagram", "Instagram URL"],
              ["youtube", "YouTube URL"],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label className="block text-xs text-gray-400 mb-1">
                {label}
              </label>
              <input
                type="url"
                value={info.socialMedia[field]}
                onChange={(e) => updateSocial(field, e.target.value)}
                className={inputClass()}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
