import { useState } from "react";
import { ChevronDown } from "lucide-react";
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

  // Collapsible by default. With <=3 days everything is expanded; with more,
  // only empty (placeholder) days stay expanded so an admin can fill them in.
  // Newly added days always auto-expand.
  const [expanded, setExpanded] = useState<Set<number>>(() => {
    if (items.length <= 3) return new Set(items.map((_, i) => i));
    const next = new Set<number>();
    items.forEach((item, i) => {
      if (!item.title.trim() && !item.description.trim()) next.add(i);
    });
    return next;
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

  const add = () => {
    setItems((prev) => [
      ...prev,
      { day: prev.length + 1, title: "", description: "" },
    ]);
    setExpanded((prev) => {
      const next = new Set(prev);
      next.add(items.length);
      return next;
    });
  };

  const remove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    // Rebuild the expanded set so existing indices stay accurate after the shift.
    setExpanded((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
  };

  const toggle = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serialized} />

      {items.map((item, index) => {
        const isOpen = expanded.has(index);
        const summary = item.title.trim()
          ? `Day ${index + 1}: ${item.title.trim()}`
          : `Day ${index + 1} (empty)`;

        return (
          <div
            key={index}
            className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between p-3">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={`itinerary-panel-${index}`}
                className="flex items-center gap-2 text-left text-sm font-semibold text-green-400 hover:text-green-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded px-1 py-0.5 grow min-w-0"
              >
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform duration-200 ${
                    isOpen ? "" : "-rotate-90"
                  }`}
                />
                <span className="truncate">{summary}</span>
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className={buttonClass("danger")}
              >
                Remove
              </button>
            </div>

            {isOpen && (
              <div
                id={`itinerary-panel-${index}`}
                className="px-4 pb-4 space-y-3 border-t border-gray-700 pt-3"
              >
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Title
                  </label>
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
                    onChange={(e) =>
                      update(index, "description", e.target.value)
                    }
                    rows={3}
                    className={inputClass()}
                    placeholder="What happens on this day?"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

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

  // Collapsible. With <=3 FAQs everything is expanded; with more, only empty
  // FAQs stay expanded. Newly added FAQs always auto-expand.
  const [expanded, setExpanded] = useState<Set<number>>(() => {
    if (items.length <= 3) return new Set(items.map((_, i) => i));
    const next = new Set<number>();
    items.forEach((item, i) => {
      if (!item.question.trim() && !item.answer.trim()) next.add(i);
    });
    return next;
  });

  const serialized = JSON.stringify(
    items.filter((item) => item.question.trim() || item.answer.trim()),
  );

  const update = (index: number, field: keyof FaqItem, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const add = () => {
    setItems((prev) => [...prev, { question: "", answer: "" }]);
    setExpanded((prev) => {
      const next = new Set(prev);
      next.add(items.length);
      return next;
    });
  };

  const remove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setExpanded((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
  };

  const toggle = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serialized} />

      {items.map((item, index) => {
        const isOpen = expanded.has(index);
        const summary = item.question.trim()
          ? `FAQ #${index + 1}: ${item.question.trim()}`
          : `FAQ #${index + 1} (empty)`;

        return (
          <div
            key={index}
            className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between p-3">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                className="flex items-center gap-2 text-left text-sm font-semibold text-green-400 hover:text-green-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded px-1 py-0.5 grow min-w-0"
              >
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform duration-200 ${
                    isOpen ? "" : "-rotate-90"
                  }`}
                />
                <span className="truncate">{summary}</span>
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className={buttonClass("danger")}
              >
                Remove
              </button>
            </div>

            {isOpen && (
              <div
                id={`faq-panel-${index}`}
                className="px-4 pb-4 space-y-3 border-t border-gray-700 pt-3"
              >
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => update(index, "question", e.target.value)}
                    className={inputClass()}
                    placeholder="e.g. What is the fitness level required?"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Answer
                  </label>
                  <textarea
                    value={item.answer}
                    onChange={(e) => update(index, "answer", e.target.value)}
                    rows={3}
                    className={inputClass()}
                    placeholder="Write the answer here..."
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

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

  // Collapsed by default — user clicks the submenu header to expand.
  const [expandedSubmenus, setExpandedSubmenus] = useState<Set<number>>(
    () => new Set(),
  );

  const serialized = JSON.stringify(items.filter((item) => item.label.trim()));

  const updateItem = (index: number, patch: Partial<NavItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { label: "" }]);
    // Auto-expand the newly added nav item's submenu so the user can edit
    // it immediately without an extra click.
    setExpandedSubmenus((prev) => {
      const next = new Set(prev);
      next.add(items.length);
      return next;
    });
  };
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
    // Auto-expand the submenu when adding the first link to it.
    setExpandedSubmenus((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
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

  const toggleSubmenu = (index: number) => {
    setExpandedSubmenus((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serialized} />

      {items.map((item, index) => {
        const isSubmenuExpanded = expandedSubmenus.has(index);
        const submenuCount = item.submenu?.length ?? 0;

        return (
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
                <label className="block text-xs text-gray-400 mb-1">
                  Label
                </label>
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

            {/* Submenu — header always visible, items collapse/expand on click */}
            <div className="pl-4 border-l-2 border-gray-700">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(index)}
                  aria-expanded={isSubmenuExpanded}
                  aria-controls={`submenu-panel-${index}`}
                  className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-200 transition focus:outline-none focus-visible:text-white py-1"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      isSubmenuExpanded ? "" : "-rotate-90"
                    }`}
                  />
                  <span>
                    Submenu
                    {submenuCount > 0 && (
                      <span className="text-gray-500"> ({submenuCount})</span>
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => addSubmenu(index)}
                  className={buttonClass("secondary")}
                >
                  + Add Submenu Link
                </button>
              </div>

              {isSubmenuExpanded && (
                <div id={`submenu-panel-${index}`} className="space-y-3 mt-3">
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
                            updateSubmenu(index, subIndex, {
                              label: e.target.value,
                            })
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
                                href: e.target.value
                                  ? e.target.value
                                  : undefined,
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
              )}
            </div>
          </div>
        );
      })}

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

  // Collapsed by default — user clicks the category header to expand links.
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    () => new Set(),
  );

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

  const addCategory = () => {
    setCategories((prev) => [...prev, { category: "", links: [] }]);
    // Auto-expand the new category so the user can immediately add links.
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.add(categories.length);
      return next;
    });
  };
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
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.add(catIndex);
      return next;
    });
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
          ? {
              ...cat,
              links: cat.links.filter((_, j) => j !== linkIndex),
            }
          : cat,
      ),
    );
  };

  const toggleCategory = (catIndex: number) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catIndex)) {
        next.delete(catIndex);
      } else {
        next.add(catIndex);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serialized} />

      {categories.map((cat, catIndex) => {
        const isExpanded = expandedCategories.has(catIndex);
        const linkCount = cat.links.length;

        return (
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

            {/* Links — header always visible, items collapse/expand on click */}
            <div className="pl-4 border-l-2 border-gray-700">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleCategory(catIndex)}
                  aria-expanded={isExpanded}
                  aria-controls={`links-panel-${catIndex}`}
                  className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-200 transition focus:outline-none focus-visible:text-white py-1"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      isExpanded ? "" : "-rotate-90"
                    }`}
                  />
                  <span>
                    Links
                    {linkCount > 0 && (
                      <span className="text-gray-500"> ({linkCount})</span>
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => addLink(catIndex)}
                  className={buttonClass("secondary")}
                >
                  + Add Link
                </button>
              </div>

              {isExpanded && (
                <div id={`links-panel-${catIndex}`} className="space-y-3 mt-3">
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
                            updateLink(catIndex, linkIndex, {
                              label: e.target.value,
                            })
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
                </div>
              )}
            </div>
          </div>
        );
      })}

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
