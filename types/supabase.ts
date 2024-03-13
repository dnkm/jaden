export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      enroll: {
        Row: {
          cancelled_at: string | null
          created_at: string
          is_present: boolean
          note: string | null
          session_id: number
          student_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          is_present?: boolean
          note?: string | null
          session_id: number
          student_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          is_present?: boolean
          note?: string | null
          session_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enroll_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "enroll_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          full_name: string | null
          grad_year: number | null
          id: string
          updated_at: string | null
        }
        Insert: {
          full_name?: string | null
          grad_year?: number | null
          id: string
          updated_at?: string | null
        }
        Update: {
          full_name?: string | null
          grad_year?: number | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          id: string
          is_admin: boolean
          is_teacher: boolean
        }
        Insert: {
          id: string
          is_admin?: boolean
          is_teacher?: boolean
        }
        Update: {
          id?: string
          is_admin?: boolean
          is_teacher?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "roles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      sessions: {
        Row: {
          created_at: string
          datetime: string
          limit: number
          name: string | null
          session_id: number
          taken: number
          teacher: string
        }
        Insert: {
          created_at?: string
          datetime: string
          limit: number
          name?: string | null
          session_id?: number
          taken?: number
          teacher: string
        }
        Update: {
          created_at?: string
          datetime?: string
          limit?: number
          name?: string | null
          session_id?: number
          taken?: number
          teacher?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_teacher_fkey"
            columns: ["teacher"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      subjects: {
        Row: {
          name: string
          subject_id: number
        }
        Insert: {
          name: string
          subject_id?: number
        }
        Update: {
          name?: string
          subject_id?: number
        }
        Relationships: []
      }
      teacher_subject_map: {
        Row: {
          subject_id: number
          teacher_id: string
        }
        Insert: {
          subject_id: number
          teacher_id: string
        }
        Update: {
          subject_id?: number
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_subject_map_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["subject_id"]
          },
          {
            foreignKeyName: "teacher_subject_map_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subject:
        | "7th Grade Lit and Comp"
        | "7th Grade World History"
        | "8th Grade Lit and Comp"
        | "8th Grade US History"
        | "Animations I"
        | "AP Art and Design"
        | "AP Art History"
        | "AP Biology"
        | "AP Calc AB"
        | "AP Calc BC"
        | "AP Chemistry"
        | "AP Chinese Lang"
        | "AP Comp Sci Principles"
        | "AP Environmental Science"
        | "AP French"
        | "AP Government"
        | "AP Lang"
        | "AP Lit"
        | "AP Macroeconomics"
        | "AP Music Theory"
        | "AP Physics 1"
        | "AP Physics 2"
        | "AP Psychology"
        | "AP Research"
        | "AP Seminar"
        | "AP Spanish Lang"
        | "AP Statistics"
        | "AP U.S History"
        | "AP World History"
        | "Ballet Folklorico I"
        | "Ballet Folklorico II"
        | "Ballet I"
        | "Ballet II"
        | "Ballet III"
        | "Ballroom I "
        | "Ballroom II "
        | "Ballroom III "
        | "Biology of the Living Earth"
        | "Body Conditioning"
        | "Ceramics I"
        | "Chemistry"
        | "Culinary Basics"
        | "Culinary II"
        | "Dance Exploration"
        | "Dance Fitness"
        | "Digital Painting I"
        | "Drawing/Painting I"
        | "Economics"
        | "Electives:"
        | "Emergency Med Tech and Care"
        | "Environmental Science"
        | "Fashion and Costume Design"
        | "Financial Algebra"
        | "French I"
        | "French II"
        | "French III"
        | "French III H "
        | "French IV"
        | "Global Studies"
        | "Government"
        | "Graphic Design"
        | "Health Education"
        | "Health:"
        | "Hip Hop I"
        | "Hip Hop II"
        | "Honors Chemistry"
        | "Human Anatomy and Physiology"
        | "Integrated I"
        | "Integrated I A "
        | "Integrated I B"
        | "Integrated II"
        | "Integrated III"
        | "Integrated III Enh"
        | "Intro to Comp Sci"
        | "Intro to Engineering and Robotics"
        | "Jazz I"
        | "Jazz II"
        | "Jazz III"
        | "Journalism"
        | "Leadership"
        | "Lit and Comp I"
        | "Lit and Comp I H"
        | "Lit and Comp II "
        | "Lit and Comp II H"
        | "Lit and Comp III"
        | "Literature and Composition Courses:"
        | "Mandarin I"
        | "Mandarin II"
        | "Mandarin III"
        | "Mandarin IV"
        | "Mandarin IV H"
        | "Mandarin Speakers"
        | "Math 2"
        | "Math 3"
        | "Math:"
        | "Media Analysis/Modern Plays"
        | "MT Dance I"
        | "MT Dance II"
        | "Myth/Sci Fi Composition"
        | "OCEAA Guest Artists"
        | "Peer Assistance Leadership"
        | "Photography I"
        | "Physical Education:"
        | "Physics"
        | "Piano I"
        | "Piano II"
        | "Pilates"
        | "Pop Culture/Film Literature"
        | "Precalculus"
        | "Science 7"
        | "Science 8"
        | "Science Academy 7/8"
        | "Science:"
        | "SciFi/19th Century Gothic Literature"
        | "Social Science Courses:"
        | "Spanish I"
        | "Spanish II"
        | "Spanish III"
        | "Spanish IV"
        | "Spanish IV H"
        | "Spanish Speakers A"
        | "Spanish Speakers B"
        | "Spanish V - Hispanic Lit"
        | "Study Hall"
        | "Taekwondo Advanced"
        | "Taekwondo Beginning"
        | "Taekwondo Black Belt"
        | "Taekwondo Intermediate"
        | "Tap Dance I"
        | "Tap Dance II"
        | "Tap Dance III"
        | "Theatre Arts Exploration "
        | "Theatre Arts I"
        | "U.S History "
        | "Visual Arts Exploration"
        | "Vocal Ensemble"
        | "World History"
        | "World Languages:"
        | "Yearbook"
        | "Yoga"
        | "Zoology"
      subject2: "Math" | "English" | "Social Studies"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
