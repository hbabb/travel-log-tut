export type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
  const SidebarItem = ref<SidebarItem[]>([]);
  const loading = ref(false);

  return {
    loading,
    SidebarItem,
  };
});
