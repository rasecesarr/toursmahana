import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { Express } from "express";
import bcrypt from "bcrypt";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: "mahana-tours-secret-12345",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username));

        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/admin/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/admin/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/admin/me", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

export function ensureAdmin(req: any, res: any, next: any) {
  // Check for API Key (for AI Agents)
  const apiKey = req.headers["x-api-key"];
  const adminApiKey = process.env.ADMIN_API_KEY || "mahana-temp-key-change-me";

  if (apiKey && apiKey === adminApiKey) {
    return next();
  }

  // Check for Session (for Humans)
  if (req.isAuthenticated() && (req.user as any).isAdmin) {
    return next();
  }

  res.status(401).json({ message: "No autorizado. Se requiere sesión de administrador o X-API-Key válida." });
}
